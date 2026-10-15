from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.auth import UserOut, UserRegisterRequest
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
