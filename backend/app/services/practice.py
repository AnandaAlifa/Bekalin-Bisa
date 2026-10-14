from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Lesson, PracticeAnswer, PracticeAttempt, Question
from app.schemas.practice import AttemptSubmitRequest, QuestionResultOut


def list_published_questions(session: Session, lesson_id: int) -> list[Question]:
    return list(
        session.scalars(
            select(Question)
            .where(Question.lesson_id == lesson_id, Question.is_published)
            .order_by(Question.id)
        ).all()
    )


def submit_attempt(
    session: Session, lesson_id: int, payload: AttemptSubmitRequest
) -> tuple[PracticeAttempt, list[QuestionResultOut]]:
    lesson = session.get(Lesson, lesson_id)
    if lesson is None or not lesson.is_published:
        raise HTTPException(status_code=404, detail="Materi tidak ditemukan")

    questions = list_published_questions(session, lesson_id)
    if not questions:
        raise HTTPException(status_code=400, detail="Materi ini belum memiliki soal")

    questions_by_id = {question.id: question for question in questions}
    seen_question_ids: set[int] = set()
    results: list[QuestionResultOut] = []
    answers: list[PracticeAnswer] = []

    for submission in payload.answers:
        if submission.question_id in seen_question_ids:
            raise HTTPException(status_code=400, detail="Terdapat jawaban ganda pada satu soal")
        seen_question_ids.add(submission.question_id)

        question = questions_by_id.get(submission.question_id)
        if question is None:
            raise HTTPException(
                status_code=400,
                detail=f"Soal dengan id {submission.question_id} bukan bagian dari latihan ini",
            )
        valid_options = {chr(ord("A") + index) for index in range(len(question.options))}
        if submission.selected_option not in valid_options:
            raise HTTPException(
                status_code=400,
                detail=f"Pilihan jawaban tidak valid untuk soal id {submission.question_id}",
            )

        is_correct = submission.selected_option == question.correct_option
        results.append(
            QuestionResultOut(
                question_id=question.id,
                selected_option=submission.selected_option,
                is_correct=is_correct,
                correct_option=question.correct_option,
                explanation=question.explanation,
            )
        )
        answers.append(
            PracticeAnswer(
                question_id=question.id,
                selected_option=submission.selected_option,
                is_correct=is_correct,
            )
        )

    unanswered = [q.id for q in questions if q.id not in seen_question_ids]
    if unanswered:
        raise HTTPException(
            status_code=400,
            detail=f"Soal belum dijawab: {', '.join(str(qid) for qid in unanswered)}",
        )

    total = len(questions)
    correct = sum(1 for result in results if result.is_correct)
    score = round(correct * 100 / total)

    attempt = PracticeAttempt(
        lesson_id=lesson_id,
        score=score,
        total_questions=total,
        correct_answers=correct,
        answers=answers,
    )
    session.add(attempt)
    session.commit()
    session.refresh(attempt)

    return attempt, results
