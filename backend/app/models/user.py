from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, validates

from app.db.base import Base

ROLE_STUDENT = "student"
ROLE_TEACHER = "teacher"
ROLE_SCHOOL_ADMIN = "school_admin"
ALLOWED_ROLES = (ROLE_STUDENT, ROLE_TEACHER, ROLE_SCHOOL_ADMIN)


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "role IN ('student', 'teacher', 'school_admin')", name="ck_users_role"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    username: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default=ROLE_STUDENT, server_default=ROLE_STUDENT
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    @validates("email")
    def _normalize_email(self, _key: str, value: str) -> str:
        return value.strip().lower()

    @validates("role")
    def _validate_role(self, _key: str, value: str) -> str:
        if value not in ALLOWED_ROLES:
            raise ValueError(f"role must be one of {ALLOWED_ROLES}")
        return value
