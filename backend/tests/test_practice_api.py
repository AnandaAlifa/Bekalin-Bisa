from fastapi.testclient import TestClient
from sqlalchemy import select

from app.db.seed import seed_learning_content, seed_practice_questions
from app.db.session import SessionLocal
from app.main import app
from app.models import Lesson, PracticeAttempt, Question

client = TestClient(app)


def _wrong_option(question: dict) -> str:
    valid = [chr(ord("A") + index) for index in range(len(question["options"]))]
    return next(option for option in valid if option != question["correct_option"])


def _prepare_lesson_with_questions() -> tuple[int, list[dict]]:
    with SessionLocal() as session:
        seed_learning_content(session)
        seed_practice_questions(session)
        lesson = session.scalar(
            select(Lesson).where(Lesson.title == "Pengenalan Bilangan Bulat")
        )
        assert lesson is not None
        lesson_id = lesson.id
        questions = session.scalars(
            select(Question)
            .where(Question.lesson_id == lesson_id, Question.is_published)
            .order_by(Question.id)
        ).all()
        payload = [
            {
                "id": question.id,
                "correct_option": question.correct_option,
                "options": list(question.options),
            }
            for question in questions
        ]
    assert payload
    return lesson_id, payload


def test_questions_endpoint_excludes_answer_key() -> None:
    lesson_id, _ = _prepare_lesson_with_questions()

    response = client.get(f"/api/v1/lessons/{lesson_id}/questions")

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    for item in data:
        assert set(item.keys()) == {"id", "question_text", "options"}
        assert len(item["options"]) >= 2


def test_questions_lesson_not_found() -> None:
    response = client.get("/api/v1/lessons/999999/questions")
    assert response.status_code == 404
    assert response.json()["detail"] == "Materi tidak ditemukan"


def test_submit_all_correct_scores_100() -> None:
    lesson_id, questions = _prepare_lesson_with_questions()
    answers = [
        {"question_id": q["id"], "selected_option": q["correct_option"]}
        for q in questions
    ]

    response = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts", json={"answers": answers}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 100
    assert data["correct_answers"] == data["total_questions"] == len(questions)
    assert data["attempt_id"] > 0
    for result in data["results"]:
        assert result["is_correct"] is True
        assert result["correct_option"]
        assert "explanation" in result

    with SessionLocal() as session:
        stored = session.get(PracticeAttempt, data["attempt_id"])
        assert stored is not None
        assert stored.score == 100
        assert len(stored.answers) == len(questions)


def test_submit_partial_correct_scores_proportionally() -> None:
    lesson_id, questions = _prepare_lesson_with_questions()
    answers = []
    for index, question in enumerate(questions):
        selected = (
            question["correct_option"] if index == 0 else _wrong_option(question)
        )
        answers.append({"question_id": question["id"], "selected_option": selected})

    response = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts", json={"answers": answers}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["correct_answers"] == 1
    assert data["total_questions"] == len(questions)
    assert data["score"] == round(100 / len(questions))


def test_submit_all_wrong_scores_0() -> None:
    lesson_id, questions = _prepare_lesson_with_questions()
    answers = [
        {
            "question_id": q["id"],
            "selected_option": _wrong_option(q),
        }
        for q in questions
    ]

    response = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts", json={"answers": answers}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 0
    assert data["correct_answers"] == 0


def test_submit_empty_answers_rejected() -> None:
    lesson_id, _ = _prepare_lesson_with_questions()

    response = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts", json={"answers": []}
    )

    assert response.status_code == 422


def test_submit_invalid_question_id_rejected() -> None:
    lesson_id, _ = _prepare_lesson_with_questions()

    response = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts",
        json={"answers": [{"question_id": 999999, "selected_option": "A"}]},
    )

    assert response.status_code == 400
    assert "bukan bagian dari latihan" in response.json()["detail"]


def test_submit_duplicate_question_rejected() -> None:
    lesson_id, questions = _prepare_lesson_with_questions()
    question_id = questions[0]["id"]

    response = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts",
        json={
            "answers": [
                {
                    "question_id": question_id,
                    "selected_option": questions[0]["correct_option"],
                },
                {
                    "question_id": question_id,
                    "selected_option": _wrong_option(questions[0]),
                },
            ]
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Terdapat jawaban ganda pada satu soal"


def test_submit_invalid_option_value_rejected() -> None:
    lesson_id, questions = _prepare_lesson_with_questions()

    response = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts",
        json={
            "answers": [
                {"question_id": questions[0]["id"], "selected_option": "F"}
            ]
        },
    )

    assert response.status_code == 422


def test_submit_unanswered_question_rejected() -> None:
    lesson_id, questions = _prepare_lesson_with_questions()
    answers = [
        {"question_id": q["id"], "selected_option": q["correct_option"]}
        for q in questions[:-1]
    ]

    response = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts", json={"answers": answers}
    )

    assert response.status_code == 400
    assert "Soal belum dijawab" in response.json()["detail"]


def test_submit_unpublished_question_rejected() -> None:
    lesson_id, questions = _prepare_lesson_with_questions()
    with SessionLocal() as session:
        hidden = Question(
            lesson_id=lesson_id,
            question_text="Soal tersembunyi",
            options=["A", "B"],
            correct_option="A",
            is_published=False,
        )
        session.add(hidden)
        session.commit()
        hidden_id = hidden.id

    response = client.post(
        f"/api/v1/lessons/{lesson_id}/attempts",
        json={
            "answers": [
                {"question_id": q["id"], "selected_option": q["correct_option"]}
                for q in questions
            ]
            + [{"question_id": hidden_id, "selected_option": "A"}]
        },
    )

    assert response.status_code == 400
    assert "bukan bagian dari latihan" in response.json()["detail"]


def test_submit_lesson_not_found() -> None:
    response = client.post(
        "/api/v1/lessons/999999/attempts",
        json={"answers": [{"question_id": 1, "selected_option": "A"}]},
    )
    assert response.status_code == 404
