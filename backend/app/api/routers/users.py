from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models import User
from app.schemas.auth import UserOut, UserProfilePatch

router = APIRouter(tags=["users"])


@router.get("/users/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)


@router.patch("/users/me", response_model=UserOut)
def update_current_user(
    payload: UserProfilePatch,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserOut:
    if "username" in payload.model_fields_set and payload.username is not None:
        current_user.username = payload.username
    if "bio" in payload.model_fields_set:
        current_user.bio = payload.bio
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)
