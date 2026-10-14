from fastapi.testclient import TestClient
from sqlalchemy import select

from app.db.seed import seed_learning_content, seed_practice_questions
from app.db.session import SessionLocal
from app.main import app
from app.models import PracticeAttempt

client = TestClient(app)


def test_full_learning_flow() -> None:
    """Materials -> Practice -> Backend Scoring -> Results (spec §13 AGENTS)."""
    with SessionLocal() as session:
        seed_learning_content(session)
        seed_practice_questions(session)

    # 1. Pilih mata pelajaran
    subjects = client.get("/api/v1/subjects").json()
    assert subjects, "daftar mata pelajaran kosong"
    subject_id = subjects[0]["id"]

    # 2. Pilih bab
    chapters = client.get(f"/api/v1/subjects/{subject_id}/chapters").json()
    assert chapters, "daftar bab kosong"
    chapter_id = chapters[0]["id"]

    # 3. Pilih materi
    lessons = client.get(f"/api/v1/chapters/{chapter_id}/lessons").json()
    assert lessons, "daftar materi kosong"

    lesson = next((item for item in lessons if item["title"] == "Pengenalan Bilangan Bulat"), None)
    assert lesson is not None, "materi latihan seed tidak ditemukan"
    lesson_id = lesson["id"]

    # 4. Baca detail materi
    detail = client.get(f"/api/v1/lessons/{lesson_id}").json()
    assert detail["content"]
    assert "note" in detail

    # 5. Buka latihan terkait — soal tanpa kunci jawaban
    questions = client.get(f"/api/v1/lessons/{lesson_id}/questions").json()
    assert len(questions) >= 3
    for question in questions:
        assert "correct_option" not in question
        assert "explanation" not in question

    # 6. Kerjakan: 2 pertama benar, sisanya salah (pilihan lain yang valid)
    correct_map = {}
    with SessionLocal() as session:
        from app.models import Question

        for row in session.scalars(
            select(Question).where(
                Question.lesson_id == lesson_id, Question.is_published
            )
        ):
            correct_map[row.id] = (row.correct_option, len(row.options))

    answers = []
    expected_correct = 0
    for index, question in enumerate(questions):
        correct_option, option_count = correct_map[question["id"]]
        if index < 2:
            selected = correct_option
            expected_correct += 1
        else:
            letters = [chr(ord("A") + i) for i in range(option_count)]
            selected = next(letter for letter in letters if letter != correct_option)
        answers.append({"question_id": question["id"], "selected_option": selected})

    # 7. Submit — backend menghitung nilai
    result = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts", json={"answers": answers}
    )
    assert result.status_code == 200
    data = result.json()
    total = len(questions)
    assert data["total_questions"] == total
    assert data["correct_answers"] == expected_correct
    assert data["score"] == round(expected_correct * 100 / total)
    assert len(data["results"]) == total
    assert any(item["explanation"] for item in data["results"])

    # 8. Hasil tersimpan di database dan terhubung ke attempt yang benar
    with SessionLocal() as session:
        stored = session.get(PracticeAttempt, data["attempt_id"])
        assert stored is not None
        assert stored.lesson_id == lesson_id
        assert stored.score == data["score"]
        assert len(stored.answers) == total
        assert all(answer.attempt_id == stored.id for answer in stored.answers)

    # 9. Uji ulang (fresh attempt) — attempt baru tersimpan, id berbeda
    retry = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts",
        json={
            "answers": [
                {"question_id": q["id"], "selected_option": correct_map[q["id"]][0]}
                for q in questions
            ]
        },
    )
    assert retry.status_code == 200
    retry_data = retry.json()
    assert retry_data["score"] == 100
    assert retry_data["attempt_id"] != data["attempt_id"]

    with SessionLocal() as session:
        attempts = session.scalars(
            select(PracticeAttempt).where(PracticeAttempt.id == retry_data["attempt_id"])
        ).all()
        assert len(attempts) == 1
