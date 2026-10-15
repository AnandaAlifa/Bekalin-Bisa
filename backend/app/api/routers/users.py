from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models import User
from app.schemas.auth import UserOut

router = APIRouter(tags=["users"])


@router.get("/users/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)
