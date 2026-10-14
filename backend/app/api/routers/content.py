from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.content import (
    ChapterOut,
    LessonDetailOut,
    LessonListItemOut,
    SubjectOut,
)
from app.services import content as content_service

router = APIRouter(tags=["content"])


@router.get("/subjects", response_model=list[SubjectOut])
def list_subjects(db: Session = Depends(get_db)) -> list[SubjectOut]:
    subjects = content_service.list_published_subjects(db)
    return [SubjectOut.model_validate(subject) for subject in subjects]


@router.get("/subjects/{subject_id}/chapters", response_model=list[ChapterOut])
def list_chapters(
    subject_id: int, db: Session = Depends(get_db)
) -> list[ChapterOut]:
    if content_service.get_published_subject(db, subject_id) is None:
        raise HTTPException(status_code=404, detail="Mata pelajaran tidak ditemukan")
    chapters = content_service.list_published_chapters(db, subject_id)
    return [ChapterOut.model_validate(chapter) for chapter in chapters]


@router.get("/chapters/{chapter_id}/lessons", response_model=list[LessonListItemOut])
def list_lessons(
    chapter_id: int, db: Session = Depends(get_db)
) -> list[LessonListItemOut]:
    if content_service.get_published_chapter(db, chapter_id) is None:
        raise HTTPException(status_code=404, detail="Bab tidak ditemukan")
    lessons = content_service.list_published_lessons(db, chapter_id)
    return [LessonListItemOut.model_validate(lesson) for lesson in lessons]


@router.get("/lessons/{lesson_id}", response_model=LessonDetailOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)) -> LessonDetailOut:
    lesson = content_service.get_published_lesson(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Materi tidak ditemukan")
    return LessonDetailOut.model_validate(lesson)
