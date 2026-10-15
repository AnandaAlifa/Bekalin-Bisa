import bcrypt
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


def test_register_creates_user_with_hashed_password() -> None:
    email = "register-ok@test.sch.id"
    try:
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "Register-OK@Test.sch.id",
                "password": "rahasia123",
                "username": "regsukses",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert set(data.keys()) == {"id", "email", "username", "role", "bio"}
        assert data["email"] == email
        assert data["username"] == "regsukses"
        assert data["role"] == "student"
        assert data["bio"] is None
        assert "password" not in data

        with SessionLocal() as session:
            user = session.scalar(select(User).where(User.email == email))
            assert user is not None
            assert user.password_hash != "rahasia123"
            assert "rahasia123" not in user.password_hash
            assert user.password_hash.startswith("$2b$")
            assert bcrypt.checkpw(
                "rahasia123".encode("utf-8"), user.password_hash.encode("utf-8")
            )
    finally:
        _cleanup(email)


def test_register_rejects_duplicate_email() -> None:
    email = "dup-register@test.sch.id"
    try:
        first = client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": "password123", "username": "pertama"},
        )
        assert first.status_code == 201

        second = client.post(
            "/api/v1/auth/register",
            json={
                "email": "DUP-REGISTER@test.sch.id",
                "password": "password456",
                "username": "kedua",
            },
        )
        assert second.status_code == 409
        assert second.json() == {"detail": "Email sudah terdaftar"}

        with SessionLocal() as session:
            matches = session.scalars(select(User).where(User.email == email)).all()
            assert len(matches) == 1
    finally:
        _cleanup(email)


def test_register_rejects_invalid_email() -> None:
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "bukan-email", "password": "password123", "username": "siswa"},
    )
    assert response.status_code == 422


def test_register_rejects_short_password() -> None:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "shortpass@test.sch.id",
            "password": "pendek",
            "username": "siswa",
        },
    )
    assert response.status_code == 422


def test_register_rejects_short_username() -> None:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "shortname@test.sch.id",
            "password": "password123",
            "username": "ab",
        },
    )
    assert response.status_code == 422


def test_register_ignores_client_supplied_role() -> None:
    email = "role-ignored@test.sch.id"
    try:
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": email,
                "password": "password123",
                "username": "sopan",
                "role": "admin",
            },
        )
        assert response.status_code == 201
        assert response.json()["role"] == "student"
    finally:
        _cleanup(email)


def test_register_errors_do_not_leak_secrets() -> None:
    email = "leak-check@test.sch.id"
    try:
        client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": "password123", "username": "awas"},
        )
        duplicate = client.post(
            "/api/v1/auth/register",
            json={"email": email, "password": "password456", "username": "awas2"},
        )
        assert duplicate.status_code == 409
        body = duplicate.text.lower()
        assert "traceback" not in body
        assert "password_hash" not in body
        assert "password123" not in duplicate.text
        assert "password456" not in duplicate.text

        invalid = client.post(
            "/api/v1/auth/register",
            json={"email": "x", "password": "y", "username": "z"},
        )
        assert invalid.status_code == 422
        invalid_body = invalid.text.lower()
        assert "traceback" not in invalid_body
        assert "password_hash" not in invalid_body
    finally:
        _cleanup(email)
