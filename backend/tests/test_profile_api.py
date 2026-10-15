from fastapi.testclient import TestClient
from sqlalchemy import select

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


def _login(email: str, password: str = "password123") -> dict[str, str]:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def test_patch_profile_requires_authentication() -> None:
    response = client.patch("/api/v1/users/me", json={"username": "tanpa-token"})
    assert response.status_code == 401


def test_patch_profile_updates_username_and_bio() -> None:
    email = "patch-ok@test.sch.id"
    try:
        _register(email, username="namalama")
        headers = _login(email)
        response = client.patch(
            "/api/v1/users/me",
            headers=headers,
            json={"username": "namabaru", "bio": "Siswa baru."},
        )
        assert response.status_code == 200
        body = response.json()
        assert body["username"] == "namabaru"
        assert body["bio"] == "Siswa baru."
        assert body["email"] == email

        with SessionLocal() as session:
            user = session.scalar(select(User).where(User.email == email))
            assert user is not None
            assert user.username == "namabaru"
            assert user.bio == "Siswa baru."
    finally:
        _cleanup(email)


def test_patch_profile_can_clear_bio() -> None:
    email = "patch-clearbio@test.sch.id"
    try:
        _register(email)
        headers = _login(email)
        client.patch("/api/v1/users/me", headers=headers, json={"bio": "Awal"})
        response = client.patch("/api/v1/users/me", headers=headers, json={"bio": None})
        assert response.status_code == 200
        assert response.json()["bio"] is None
    finally:
        _cleanup(email)


def test_patch_profile_rejects_short_username() -> None:
    email = "patch-short@test.sch.id"
    try:
        _register(email)
        headers = _login(email)
        response = client.patch(
            "/api/v1/users/me", headers=headers, json={"username": "ab"}
        )
        assert response.status_code == 422
    finally:
        _cleanup(email)


def test_patch_profile_rejects_long_bio() -> None:
    email = "patch-longbio@test.sch.id"
    try:
        _register(email)
        headers = _login(email)
        response = client.patch(
            "/api/v1/users/me", headers=headers, json={"bio": "x" * 501}
        )
        assert response.status_code == 422
    finally:
        _cleanup(email)


def test_patch_profile_ignores_role_and_email() -> None:
    email = "patch-immutable@test.sch.id"
    try:
        _register(email, username="siswaasli")
        headers = _login(email)
        response = client.patch(
            "/api/v1/users/me",
            headers=headers,
            json={
                "username": "siswabaru",
                "role": "school_admin",
                "email": "dicuri@test.sch.id",
            },
        )
        assert response.status_code == 200
        body = response.json()
        assert body["username"] == "siswabaru"
        assert body["role"] == "student"
        assert body["email"] == email

        with SessionLocal() as session:
            user = session.scalar(select(User).where(User.email == email))
            assert user is not None
            assert user.role == "student"
    finally:
        _cleanup(email, "dicuri@test.sch.id")
