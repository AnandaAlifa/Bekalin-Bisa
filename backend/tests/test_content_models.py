from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.seed import seed_learning_content
from app.db.session import SessionLocal
from app.models import Chapter, Lesson, Subject


def test_seed_learning_content_creates_structure() -> None:
    with SessionLocal() as session:
        added = seed_learning_content(session)
        if added:
            assert added == 2

        subjects = session.scalars(select(Subject)).all()
        assert len(subjects) >= 2

        subject = subjects[0]
        assert subject.chapters, "mata pelajaran harus punya bab"
        chapter = subject.chapters[0]
        assert chapter.subject_id == subject.id
        assert chapter.lessons, "bab harus punya subbab/materi"
        lesson = chapter.lessons[0]
        assert lesson.chapter_id == chapter.id
        assert lesson.content
        assert chapter.sort_order <= subject.chapters[-1].sort_order


def test_seed_is_idempotent() -> None:
    with SessionLocal() as session:
        seed_learning_content(session)
        before = session.scalar(select(Chapter.id).limit(1))
        assert before is not None
        second = seed_learning_content(session)
        assert second == 0


def test_cascade_delete_subject_removes_children() -> None:
    with SessionLocal() as session:
        subject = Subject(
            name="Uji Cascade",
            description="Sementara untuk pengujian cascade",
            is_published=False,
            chapters=[
                Chapter(
                    title="Bab Uji",
                    sort_order=99,
                    is_published=False,
                    lessons=[
                        Lesson(
                            title="Materi Uji",
                            content="Isi sementara",
                            note=None,
                            sort_order=1,
                            is_published=False,
                        )
                    ],
                )
            ],
        )
        session.add(subject)
        session.commit()
        subject_id = subject.id

        session.delete(subject)
        session.commit()

        remaining = session.get(Subject, subject_id)
        assert remaining is None
        assert session.scalar(select(Lesson.id).limit(1)) is not None
