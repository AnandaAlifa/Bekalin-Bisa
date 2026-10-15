from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import ROLE_STUDENT, User
from app.schemas.auth import UserRegisterRequest


def register_user(session: Session, payload: UserRegisterRequest) -> User:
    email = payload.email.strip().lower()
    existing = session.scalar(select(User).where(User.email == email))
    if existing is not None:
        raise HTTPException(status_code=409, detail="Email sudah terdaftar")

    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        username=payload.username,
        role=ROLE_STUDENT,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
