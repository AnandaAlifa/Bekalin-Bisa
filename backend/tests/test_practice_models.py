from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.seed import seed_learning_content, seed_practice_questions
from app.db.session import SessionLocal
from app.models import Lesson, PracticeAnswer, PracticeAttempt, Question


def test_seed_practice_questions_creates_questions() -> None:
    with SessionLocal() as session:
        seed_learning_content(session)
        added = seed_practice_questions(session)
        if added:
            assert added >= 3

        question = session.scalar(select(Question))
        assert question is not None
        assert len(question.options) >= 2
        assert question.correct_option in ["A", "B", "C", "D", "E"]
        assert question.explanation


def test_seed_practice_questions_is_idempotent() -> None:
    with SessionLocal() as session:
        seed_learning_content(session)
        seed_practice_questions(session)
        second = seed_practice_questions(session)
        assert second == 0


def test_attempt_stores_answers_and_scores() -> None:
    with SessionLocal() as session:
        seed_learning_content(session)
        seed_practice_questions(session)

        lesson = session.scalar(select(Lesson).where(Lesson.title == "Pengenalan Bilangan Bulat"))
        assert lesson is not None
        questions = session.scalars(
            select(Question).where(Question.lesson_id == lesson.id)
        ).all()
        assert questions

        attempt = PracticeAttempt(
            lesson_id=lesson.id,
            score=80,
            total_questions=len(questions),
            correct_answers=len(questions) - 1,
            answers=[
                PracticeAnswer(
                    question_id=questions[0].id,
                    selected_option=questions[0].correct_option,
                    is_correct=True,
                ),
                PracticeAnswer(
                    question_id=questions[1].id,
                    selected_option="Z",
                    is_correct=False,
                ),
            ],
        )
        session.add(attempt)
        session.commit()

        stored = session.get(PracticeAttempt, attempt.id)
        assert stored is not None
        assert len(stored.answers) == 2
        assert all(answer.attempt_id == stored.id for answer in stored.answers)


def test_attempt_cascade_delete_removes_answers() -> None:
    with SessionLocal() as session:
        seed_learning_content(session)
        seed_practice_questions(session)

        lesson = session.scalar(select(Lesson).where(Lesson.title == "Pengenalan Bilangan Bulat"))
        assert lesson is not None
        question = session.scalar(select(Question).where(Question.lesson_id == lesson.id))
        assert question is not None

        attempt = PracticeAttempt(
            lesson_id=lesson.id,
            score=0,
            total_questions=1,
            correct_answers=0,
            answers=[
                PracticeAnswer(
                    question_id=question.id,
                    selected_option="A",
                    is_correct=False,
                )
            ],
        )
        session.add(attempt)
        session.commit()
        attempt_id = attempt.id

        session.delete(attempt)
        session.commit()

        assert session.get(PracticeAttempt, attempt_id) is None
        remaining = session.scalar(select(PracticeAnswer.id).limit(1))
        assert remaining is not None
