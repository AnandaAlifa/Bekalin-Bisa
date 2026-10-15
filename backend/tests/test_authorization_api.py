from fastapi.testclient import TestClient
from sqlalchemy import select

from app.db.session import SessionLocal
from app.main import app
from app.models import Lesson, User

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


def _promote(email: str, role: str) -> None:
    with SessionLocal() as session:
        user = session.scalar(select(User).where(User.email == email))
        assert user is not None
        user.role = role
        session.commit()


def _login(email: str, password: str = "password123") -> dict[str, str]:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def test_register_ignores_role_field_and_stays_student() -> None:
    email = "role-inject@test.sch.id"
    try:
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": email,
                "password": "password123",
                "username": "sneaky",
                "role": "school_admin",
            },
        )
        assert response.status_code == 201
        assert response.json()["role"] == "student"
    finally:
        _cleanup(email)


def test_admin_endpoints_require_authentication() -> None:
    assert client.post("/api/v1/admin/users", json={}).status_code == 401
    assert client.patch("/api/v1/admin/lessons/1", json={}).status_code == 401


def test_admin_endpoints_forbidden_for_student() -> None:
    email = "student-403@test.sch.id"
    try:
        _register(email)
        headers = _login(email)
        assert (
            client.post(
                "/api/v1/admin/users",
                headers=headers,
                json={
                    "email": "x@test.sch.id",
                    "password": "password123",
                    "username": "guru",
                    "role": "teacher",
                },
            ).status_code
            == 403
        )
        assert (
            client.patch(
                "/api/v1/admin/lessons/1",
                headers=headers,
                json={"is_published": False},
            ).status_code
            == 403
        )
    finally:
        _cleanup(email)


def test_admin_endpoints_forbidden_for_teacher() -> None:
    email = "teacher-403@test.sch.id"
    try:
        _register(email)
        _promote(email, "teacher")
        headers = _login(email)
        response = client.post(
            "/api/v1/admin/users",
            headers=headers,
            json={
                "email": "x2@test.sch.id",
                "password": "password123",
                "username": "guru2",
                "role": "teacher",
            },
        )
        assert response.status_code == 403
        assert response.json() == {"detail": "Akses ditolak"}
    finally:
        _cleanup(email, "x2@test.sch.id")


def test_school_admin_creates_teacher_account() -> None:
    admin_email = "schooladmin-create@test.sch.id"
    teacher_email = "created-teacher@test.sch.id"
    try:
        _register(admin_email)
        _promote(admin_email, "school_admin")
        headers = _login(admin_email)
        response = client.post(
            "/api/v1/admin/users",
            headers=headers,
            json={
                "email": teacher_email,
                "password": "password123",
                "username": "guru-baru",
                "role": "teacher",
            },
        )
        assert response.status_code == 201
        body = response.json()
        assert body["email"] == teacher_email
        assert body["role"] == "teacher"
        assert "password" not in body

        login = client.post(
            "/api/v1/auth/login",
            json={"email": teacher_email, "password": "password123"},
        )
        assert login.status_code == 200
        assert login.json()["user"]["role"] == "teacher"
    finally:
        _cleanup(admin_email, teacher_email)


def test_create_staff_user_duplicate_email_returns_409() -> None:
    admin_email = "schooladmin-dup@test.sch.id"
    try:
        _register(admin_email)
        _promote(admin_email, "school_admin")
        headers = _login(admin_email)
        response = client.post(
            "/api/v1/admin/users",
            headers=headers,
            json={
                "email": admin_email,
                "password": "password123",
                "username": "dupe",
                "role": "teacher",
            },
        )
        assert response.status_code == 409
        assert response.json() == {"detail": "Email sudah terdaftar"}
    finally:
        _cleanup(admin_email)


def test_create_staff_user_rejects_student_role() -> None:
    admin_email = "schooladmin-role@test.sch.id"
    try:
        _register(admin_email)
        _promote(admin_email, "school_admin")
        headers = _login(admin_email)
        response = client.post(
            "/api/v1/admin/users",
            headers=headers,
            json={
                "email": "bukan-staf@test.sch.id",
                "password": "password123",
                "username": "siswa",
                "role": "student",
            },
        )
        assert response.status_code == 422
    finally:
        _cleanup(admin_email)


def test_moderate_lesson_toggles_is_published() -> None:
    admin_email = "schooladmin-lesson@test.sch.id"
    try:
        _register(admin_email)
        _promote(admin_email, "school_admin")
        headers = _login(admin_email)

        with SessionLocal() as session:
            lesson = session.scalar(select(Lesson).limit(1))
            assert lesson is not None
            lesson_id = lesson.id
            original = lesson.is_published

        unpublish = client.patch(
            f"/api/v1/admin/lessons/{lesson_id}",
            headers=headers,
            json={"is_published": False},
        )
        assert unpublish.status_code == 200
        assert unpublish.json() == {"id": lesson_id, "is_published": False}

        republish = client.patch(
            f"/api/v1/admin/lessons/{lesson_id}",
            headers=headers,
            json={"is_published": True},
        )
        assert republish.status_code == 200
        assert republish.json() == {"id": lesson_id, "is_published": True}

        with SessionLocal() as session:
            lesson = session.get(Lesson, lesson_id)
            assert lesson is not None
            assert lesson.is_published is True
            if not original:
                lesson.is_published = original
                session.commit()
    finally:
        _cleanup(admin_email)


def test_moderate_lesson_unknown_id_returns_404() -> None:
    admin_email = "schooladmin-404@test.sch.id"
    try:
        _register(admin_email)
        _promote(admin_email, "school_admin")
        headers = _login(admin_email)
        response = client.patch(
            "/api/v1/admin/lessons/999999",
            headers=headers,
            json={"is_published": False},
        )
        assert response.status_code == 404
        assert response.json() == {"detail": "Materi tidak ditemukan"}
    finally:
        _cleanup(admin_email)
