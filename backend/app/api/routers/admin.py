from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db.session import get_db
from app.models import Lesson
from app.models.user import ROLE_SCHOOL_ADMIN
from app.schemas.admin import (
    AdminUserCreateRequest,
    LessonModerationOut,
    LessonModerationPatch,
)
from app.schemas.auth import UserOut, UserRegisterRequest
from app.services.auth import register_user

router = APIRouter(tags=["admin"])

require_school_admin = require_role(ROLE_SCHOOL_ADMIN)


@router.post(
    "/admin/users",
    response_model=UserOut,
    status_code=201,
    dependencies=[Depends(require_school_admin)],
)
def create_staff_user(
    payload: AdminUserCreateRequest,
    db: Session = Depends(get_db),
) -> UserOut:
    user = register_user(
        db,
        payload=UserRegisterRequest(
            email=payload.email,
            password=payload.password,
            username=payload.username,
        ),
        role=payload.role,
    )
    return UserOut.model_validate(user)


@router.patch(
    "/admin/lessons/{lesson_id}",
    response_model=LessonModerationOut,
    dependencies=[Depends(require_school_admin)],
)
def moderate_lesson(
    lesson_id: int,
    payload: LessonModerationPatch,
    db: Session = Depends(get_db),
) -> LessonModerationOut:
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Materi tidak ditemukan")
    lesson.is_published = payload.is_published
    db.commit()
    db.refresh(lesson)
    return LessonModerationOut(id=lesson.id, is_published=lesson.is_published)
