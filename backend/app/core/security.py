from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.core.config import get_settings

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_access_token(user_id: int) -> tuple[str, int]:
    settings = get_settings()
    expires_minutes = settings.access_token_expire_minutes
    expires_in = expires_minutes * 60
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=expires_minutes),
    }
    token = jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)
    return token, expires_in


def decode_access_token(token: str) -> int:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except jwt.PyJWTError as exc:
        raise ValueError("invalid or expired token") from exc
    sub = payload.get("sub")
    if not isinstance(sub, str) or not sub.isdigit():
        raise ValueError("invalid token subject")
    return int(sub)
