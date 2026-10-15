"""Test E2E alur autentikasi: register -> login -> users/me -> logout.

Menguji lifecycle penuh pada level API (frontend belum memiliki
framework test; verifikasi FE = typecheck/lint/build + alur ini).
"""

from datetime import datetime, timezone

import bcrypt
import jwt
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.core.config import get_settings
from app.db.session import SessionLocal
from app.main import app
from app.models import User

client = TestClient(app)


def _cleanup(*emails: str) -> None:
    with SessionLocal() as session:
        for email in emails:
            user = session.scalar(select(User).where(User.email == email))
            if user is not None:
                session.delete(user)
        session.commit()


def test_full_authentication_lifecycle() -> None:
    email = "e2e-lifecycle@test.sch.id"
    password = "KataSandi123"
    try:
        # 1. Registrasi
        register = client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": password, "username": "e2esuswa"},
        )
        assert register.status_code == 201
        registered = register.json()
        assert registered["role"] == "student"
        assert "password" not in register.text or "password_hash" not in register.text

        # 2. Registrasi ganda ditolak
        duplicate = client.post(
            "/api/v1/auth/register",
            json={"email": email.upper(), "password": password, "username": "e2edua"},
        )
        assert duplicate.status_code == 409
        assert duplicate.json() == {"detail": "Email sudah terdaftar"}

        # 3. Login
        login = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password},
        )
        assert login.status_code == 200
        session_data = login.json()
        token = session_data["access_token"]
        assert session_data["token_type"] == "bearer"
        assert session_data["expires_in"] == get_settings().access_token_expire_minutes * 60
        assert session_data["user"]["id"] == registered["id"]

        # 4. Login dengan password salah -> 401 generik
        wrong = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "password-salah-1"},
        )
        assert wrong.status_code == 401
        unknown = client.post(
            "/api/v1/auth/login",
            json={"email": "tidak-ada-e2e@test.sch.id", "password": password},
        )
        assert unknown.status_code == 401
        assert wrong.json() == unknown.json() == {"detail": "Email atau password salah"}

        # 5. Akses terlindungi dengan token
        headers = {"Authorization": f"Bearer {token}"}
        me = client.get("/api/v1/users/me", headers=headers)
        assert me.status_code == 200
        assert me.json()["email"] == email

        # 6. Tanpa token -> 401
        assert client.get("/api/v1/users/me").status_code == 401

        # 7. Logout (stateless) -> token tetap valid (limitasi terdokumentasi ADR §8)
        logout = client.post("/api/v1/auth/logout")
        assert logout.status_code == 200
        assert logout.json() == {"detail": "Berhasil keluar"}
        after_logout = client.get("/api/v1/users/me", headers=headers)
        assert after_logout.status_code == 200

        # 8. "Refresh halaman": token yang sama tetap diterima (stateless, tanpa server session)
        refreshed = client.get("/api/v1/users/me", headers=headers)
        assert refreshed.status_code == 200
        assert refreshed.json() == me.json()
    finally:
        _cleanup(email)


def test_password_hashing_is_bcrypt_with_unique_salts() -> None:
    email_a = "e2e-hash-a@test.sch.id"
    email_b = "e2e-hash-b@test.sch.id"
    try:
        for email in (email_a, email_b):
            assert (
                client.post(
                    "/api/v1/auth/register",
                    json={"email": email, "password": "password-sama", "username": "hashuser"},
                ).status_code
                == 201
            )

        with SessionLocal() as session:
            user_a = session.scalar(select(User).where(User.email == email_a))
            user_b = session.scalar(select(User).where(User.email == email_b))
            assert user_a is not None and user_b is not None

            assert user_a.password_hash.startswith("$2b$")
            assert user_a.password_hash != "password-sama"
            assert "password-sama" not in user_a.password_hash
            assert bcrypt.checkpw(
                "password-sama".encode("utf-8"), user_a.password_hash.encode("utf-8")
            )
            assert not bcrypt.checkpw(
                "password-lain".encode("utf-8"), user_a.password_hash.encode("utf-8")
            )
            # salt unik: password sama, hash berbeda
            assert user_a.password_hash != user_b.password_hash
    finally:
        _cleanup(email_a, email_b)


def test_token_claims_follow_documented_strategy() -> None:
    email = "e2e-claims@test.sch.id"
    try:
        client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": "password123", "username": "claimuser"},
        )
        login = client.post(
            "/api/v1/auth/login", json={"email": email, "password": "password123"}
        )
        token = login.json()["access_token"]

        settings = get_settings()
        claims = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        assert set(claims.keys()) >= {"sub", "iat", "exp"}
        with SessionLocal() as session:
            user = session.scalar(select(User).where(User.email == email))
            assert user is not None
            assert claims["sub"] == str(user.id)

        exp = datetime.fromtimestamp(claims["exp"], tz=timezone.utc)
        iat = datetime.fromtimestamp(claims["iat"], tz=timezone.utc)
        lifetime = (exp - iat).total_seconds()
        assert lifetime == settings.access_token_expire_minutes * 60
    finally:
        _cleanup(email)


def test_validation_error_states_are_consistent() -> None:
    cases = [
        {"email": "bukan-email", "password": "password123", "username": "validuser"},
        {"email": "valid@test.sch.id", "password": "pendek", "username": "validuser"},
        {"email": "valid@test.sch.id", "password": "password123", "username": "ab"},
    ]
    for payload in cases:
        response = client.post("/api/v1/auth/register", json=payload)
        assert response.status_code == 422
        assert "detail" in response.json()

    login_short = client.post(
        "/api/v1/auth/login",
        json={"email": "valid@test.sch.id", "password": "pendek"},
    )
    assert login_short.status_code == 422


def test_responses_never_expose_secrets_or_hashes() -> None:
    email = "e2e-noleak@test.sch.id"
    try:
        register = client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": "RahasiaBanget1", "username": "noleak"},
        )
        assert register.status_code == 201

        login = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "RahasiaBanget1"},
        )
        assert login.status_code == 200
        token = login.json()["access_token"]
        me = client.get(
            "/api/v1/users/me", headers={"Authorization": f"Bearer {token}"}
        )

        settings = get_settings()
        for response in (register, login, me):
            body = response.text
            assert "RahasiaBanget1" not in body
            assert settings.secret_key not in body
            assert "password_hash" not in body
            assert "$2b$" not in body
    finally:
        _cleanup(email)
