from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Chapter, Lesson, Subject


def list_published_subjects(session: Session) -> list[Subject]:
    return list(
        session.scalars(
            select(Subject).where(Subject.is_published).order_by(Subject.id)
        ).all()
    )


def get_published_subject(session: Session, subject_id: int) -> Subject | None:
    return session.scalar(
        select(Subject).where(Subject.id == subject_id, Subject.is_published)
    )


def list_published_chapters(session: Session, subject_id: int) -> list[Chapter]:
    return list(
        session.scalars(
            select(Chapter)
            .where(Chapter.subject_id == subject_id, Chapter.is_published)
            .order_by(Chapter.sort_order)
        ).all()
    )


def get_published_chapter(session: Session, chapter_id: int) -> Chapter | None:
    return session.scalar(
        select(Chapter).where(Chapter.id == chapter_id, Chapter.is_published)
    )


def list_published_lessons(session: Session, chapter_id: int) -> list[Lesson]:
    return list(
        session.scalars(
            select(Lesson)
            .where(Lesson.chapter_id == chapter_id, Lesson.is_published)
            .order_by(Lesson.sort_order)
        ).all()
    )


def get_published_lesson(session: Session, lesson_id: int) -> Lesson | None:
    return session.scalar(
        select(Lesson).where(Lesson.id == lesson_id, Lesson.is_published)
    )
