from typing import Literal

from pydantic import BaseModel, EmailStr, Field

StaffRole = Literal["teacher", "school_admin"]


class AdminUserCreateRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    username: str = Field(min_length=3, max_length=100)
    role: StaffRole


class LessonModerationPatch(BaseModel):
    is_published: bool


class LessonModerationOut(BaseModel):
    id: int
    is_published: bool
