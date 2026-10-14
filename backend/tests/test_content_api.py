from fastapi.testclient import TestClient
from sqlalchemy import select

from app.db.session import SessionLocal
from app.main import app
from app.models import Subject

client = TestClient(app)


def _first_subject_id() -> int:
    with SessionLocal() as session:
        subject = session.scalar(select(Subject).where(Subject.is_published))
        assert subject is not None
        return subject.id


def test_list_subjects_returns_published_data() -> None:
    response = client.get("/api/v1/subjects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and data
    first = data[0]
    assert set(first.keys()) == {"id", "name", "description"}


def test_list_chapters_for_existing_subject() -> None:
    subject_id = _first_subject_id()
    response = client.get(f"/api/v1/subjects/{subject_id}/chapters")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list) and data
    assert set(data[0].keys()) == {"id", "title", "sort_order"}


def test_list_chapters_unknown_subject_returns_404() -> None:
    response = client.get("/api/v1/subjects/999999/chapters")
    assert response.status_code == 404
    assert response.json()["detail"] == "Mata pelajaran tidak ditemukan"


def test_list_lessons_and_unknown_chapter_returns_404() -> None:
    subject_id = _first_subject_id()
    chapters = client.get(f"/api/v1/subjects/{subject_id}/chapters").json()
    chapter_id = chapters[0]["id"]

    response = client.get(f"/api/v1/chapters/{chapter_id}/lessons")
    assert response.status_code == 200
    lessons = response.json()
    assert isinstance(lessons, list) and lessons
    assert set(lessons[0].keys()) == {"id", "title", "sort_order"}

    missing = client.get("/api/v1/chapters/999999/lessons")
    assert missing.status_code == 404
    assert missing.json()["detail"] == "Bab tidak ditemukan"


def test_lesson_detail_and_unknown_lesson_returns_404() -> None:
    subject_id = _first_subject_id()
    chapters = client.get(f"/api/v1/subjects/{subject_id}/chapters").json()
    lessons = client.get(f"/api/v1/chapters/{chapters[0]['id']}/lessons").json()
    lesson_id = lessons[0]["id"]

    response = client.get(f"/api/v1/lessons/{lesson_id}")
    assert response.status_code == 200
    detail = response.json()
    assert set(detail.keys()) == {
        "id",
        "chapter_id",
        "title",
        "content",
        "note",
        "sort_order",
    }
    assert detail["content"]

    missing = client.get("/api/v1/lessons/999999")
    assert missing.status_code == 404
    assert missing.json()["detail"] == "Materi tidak ditemukan"


def test_unpublished_subject_is_hidden() -> None:
    with SessionLocal() as session:
        subject = Subject(
            name="Tersembunyi",
            description="Tidak boleh muncul di API",
            is_published=False,
        )
        session.add(subject)
        session.commit()
        hidden_id = subject.id

    response = client.get("/api/v1/subjects")
    ids = [item["id"] for item in response.json()]
    assert hidden_id not in ids

    detail = client.get(f"/api/v1/subjects/{hidden_id}/chapters")
    assert detail.status_code == 404
