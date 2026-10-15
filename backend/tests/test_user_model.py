import pytest
from sqlalchemy import inspect, select, text
from sqlalchemy.exc import IntegrityError

from app.db.session import SessionLocal
from app.models import Subject, User


def _cleanup(session, *emails: str) -> None:
    for email in emails:
        user = session.scalar(select(User).where(User.email == email))
        if user is not None:
            session.delete(user)
    session.commit()


def test_user_model_follows_conventions_and_defaults() -> None:
    with SessionLocal() as session:
        user = User(
            email="Budi@student.sch.id",
            password_hash="hashed-not-plaintext",
            username="Budi",
        )
        session.add(user)
        session.commit()

        try:
            stored = session.get(User, user.id)
            assert stored is not None
            assert stored.email == "budi@student.sch.id"
            assert stored.username == "Budi"
            assert stored.bio is None
            assert stored.role == "student"
            assert stored.created_at is not None
            assert stored.updated_at is not None
            assert stored.password_hash == "hashed-not-plaintext"

            columns = {c["name"]: c for c in inspect(session.get_bind()).get_columns("users")}
            assert "password_hash" in columns
            assert "password" not in columns
        finally:
            _cleanup(session, "budi@student.sch.id")


def test_duplicate_email_rejected_by_database_constraint() -> None:
    with SessionLocal() as session:
        try:
            session.add(
                User(
                    email="dup@test.sch.id",
                    password_hash="hash-1",
                    username="First",
                )
            )
            session.commit()

            session.add(
                User(
                    email="dup@test.sch.id",
                    password_hash="hash-2",
                    username="Second",
                )
            )
            with pytest.raises(IntegrityError):
                session.commit()
            session.rollback()
        finally:
            _cleanup(session, "dup@test.sch.id")

        remaining = session.scalar(select(User).where(User.email == "dup@test.sch.id"))
        assert remaining is None


def test_case_variant_duplicate_email_rejected() -> None:
    with SessionLocal() as session:
        try:
            session.add(User(email="Case@Test.sch.id", password_hash="h1", username="A"))
            session.commit()

            session.add(User(email="case@test.sch.id", password_hash="h2", username="B"))
            with pytest.raises(IntegrityError):
                session.commit()
            session.rollback()
        finally:
            _cleanup(session, "case@test.sch.id")

        remaining = session.scalar(select(User).where(User.email == "case@test.sch.id"))
        assert remaining is None


def test_invalid_role_rejected_by_orm_validator() -> None:
    with SessionLocal() as session:
        with pytest.raises(ValueError):
            User(
                email="badrole@test.sch.id",
                password_hash="h",
                username="X",
                role="superuser",
            )


def test_staff_roles_accepted_by_orm_validator() -> None:
    teacher = User(
        email="teacher-ok@test.sch.id",
        password_hash="h",
        username="T",
        role="teacher",
    )
    school_admin = User(
        email="admin-ok@test.sch.id",
        password_hash="h",
        username="A",
        role="school_admin",
    )
    assert teacher.role == "teacher"
    assert school_admin.role == "school_admin"


def test_invalid_role_rejected_by_database_check_constraint() -> None:
    with SessionLocal() as session:
        with pytest.raises(IntegrityError) as exc:
            session.execute(
                text(
                    "INSERT INTO users (email, password_hash, username, role) "
                    "VALUES ('rawcheck@test.sch.id', 'h', 'Raw', 'superuser')"
                )
            )
        assert "ck_users_role" in str(exc.value.orig)
        session.rollback()

        remaining = session.scalar(select(User).where(User.email == "rawcheck@test.sch.id"))
        assert remaining is None


def test_migration_preserves_existing_data() -> None:
    with SessionLocal() as session:
        tables = set(inspect(session.get_bind()).get_table_names())
        assert {"users", "subjects", "chapters", "lessons", "questions"}.issubset(tables)

        subject = session.scalar(select(Subject))
        assert subject is not None
        assert subject.id is not None
