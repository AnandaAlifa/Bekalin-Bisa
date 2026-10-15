from collections.abc import Callable
from typing import TypeVar

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models import User

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Belum terautentikasi")
    try:
        user_id = decode_access_token(credentials.credentials)
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Sesi telah berakhir") from exc
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="Sesi telah berakhir")
    return user


_R = TypeVar("_R")


def require_role(*allowed_roles: str) -> Callable[[User], User]:
    if not allowed_roles:
        raise ValueError("require_role needs at least one role")

    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Akses ditolak")
        return current_user

    return dependency


__all__ = ["get_db", "get_current_user", "require_role"]
