from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.security import create_access_token
from app.schemas.auth import (
    MessageOut,
    TokenOut,
    UserLoginRequest,
    UserOut,
    UserRegisterRequest,
)
from app.services import auth as auth_service

router = APIRouter(tags=["auth"])


@router.post(
    "/auth/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
def register(payload: UserRegisterRequest, db: Session = Depends(get_db)) -> UserOut:
    user = auth_service.register_user(db, payload)
    return UserOut.model_validate(user)


@router.post("/auth/login", response_model=TokenOut)
def login(payload: UserLoginRequest, db: Session = Depends(get_db)) -> TokenOut:
    user = auth_service.authenticate_user(db, payload)
    token, expires_in = create_access_token(user.id)
    return TokenOut(
        access_token=token,
        expires_in=expires_in,
        user=UserOut.model_validate(user),
    )


@router.post("/auth/logout", response_model=MessageOut)
def logout() -> MessageOut:
    return MessageOut(detail="Berhasil keluar")
