from datetime import datetime, timedelta, timezone

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


def _register(email: str, password: str = "password123", username: str = "pengguna") -> None:
    response = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "username": username},
    )
    assert response.status_code == 201


def test_login_with_valid_credentials_returns_token() -> None:
    email = "login-ok@test.sch.id"
    try:
        _register(email, "password123", "siswalogin")

        response = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "password123"},
        )

        assert response.status_code == 200
        data = response.json()
        assert set(data.keys()) == {"access_token", "token_type", "expires_in", "user"}
        assert data["token_type"] == "bearer"
        assert data["expires_in"] == get_settings().access_token_expire_minutes * 60
        assert data["user"]["email"] == email
        assert data["user"]["role"] == "student"
        assert "password" not in data["user"]

        payload = jwt.decode(
            data["access_token"],
            get_settings().secret_key,
            algorithms=["HS256"],
        )
        with SessionLocal() as session:
            user = session.scalar(select(User).where(User.email == email))
            assert user is not None
            assert payload["sub"] == str(user.id)
    finally:
        _cleanup(email)


def test_login_is_case_insensitive_on_email() -> None:
    email = "login-case@test.sch.id"
    try:
        _register(email)
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "LOGIN-CASE@test.sch.id", "password": "password123"},
        )
        assert response.status_code == 200
    finally:
        _cleanup(email)


def test_login_wrong_password_returns_generic_401() -> None:
    email = "login-wrongpass@test.sch.id"
    try:
        _register(email, "password123")
        response = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "salahbanget"},
        )
        assert response.status_code == 401
        assert response.json() == {"detail": "Email atau password salah"}
    finally:
        _cleanup(email)


def test_login_unknown_email_returns_same_generic_401() -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "tidak-ada@test.sch.id", "password": "password123"},
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Email atau password salah"}


def test_users_me_without_token_is_unauthorized() -> None:
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401
    assert response.json() == {"detail": "Belum terautentikasi"}


def test_users_me_with_garbage_token_is_unauthorized() -> None:
    response = client.get(
        "/api/v1/users/me", headers={"Authorization": "Bearer bukan-token"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Sesi telah berakhir"}


def test_users_me_with_wrong_secret_token_is_unauthorized() -> None:
    forged = jwt.encode(
        {
            "sub": "1",
            "iat": datetime.now(timezone.utc),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
        },
        "secret-berbeda",
        algorithm="HS256",
    )
    response = client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {forged}"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Sesi telah berakhir"}


def test_users_me_with_expired_token_is_unauthorized() -> None:
    email = "login-expired@test.sch.id"
    try:
        _register(email)
        expired = jwt.encode(
            {
                "sub": "999999",
                "iat": datetime.now(timezone.utc) - timedelta(minutes=10),
                "exp": datetime.now(timezone.utc) - timedelta(minutes=5),
            },
            get_settings().secret_key,
            algorithm="HS256",
        )
        response = client.get(
            "/api/v1/users/me", headers={"Authorization": f"Bearer {expired}"}
        )
        assert response.status_code == 401
        assert response.json() == {"detail": "Sesi telah berakhir"}
    finally:
        _cleanup(email)


def test_users_me_with_valid_token_returns_profile() -> None:
    email = "login-me@test.sch.id"
    try:
        _register(email, "password123", "siswa-profil")
        login = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "password123"},
        )
        token = login.json()["access_token"]

        response = client.get(
            "/api/v1/users/me", headers={"Authorization": f"Bearer {token}"}
        )

        assert response.status_code == 200
        data = response.json()
        assert set(data.keys()) == {"id", "email", "username", "role", "bio"}
        assert data["email"] == email
        assert data["username"] == "siswa-profil"
    finally:
        _cleanup(email)


def test_users_me_token_for_deleted_user_is_unauthorized() -> None:
    email = "login-deleted@test.sch.id"
    _register(email)
    login = client.post(
        "/api/v1/auth/login", json={"email": email, "password": "password123"}
    )
    token = login.json()["access_token"]
    _cleanup(email)

    response = client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Sesi telah berakhir"}


def test_logout_returns_success_message() -> None:
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    assert response.json() == {"detail": "Berhasil keluar"}
