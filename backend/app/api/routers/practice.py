from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.practice import (
    AttemptResultOut,
    AttemptSubmitRequest,
    QuestionOut,
)
from app.services import content as content_service
from app.services import practice as practice_service

router = APIRouter(tags=["practice"])


@router.get("/lessons/{lesson_id}/questions", response_model=list[QuestionOut])
def list_lesson_questions(
    lesson_id: int, db: Session = Depends(get_db)
) -> list[QuestionOut]:
    if content_service.get_published_lesson(db, lesson_id) is None:
        raise HTTPException(status_code=404, detail="Materi tidak ditemukan")
    questions = practice_service.list_published_questions(db, lesson_id)
    return [QuestionOut.model_validate(question) for question in questions]


@router.post("/lessons/{lesson_id}/attempts", response_model=AttemptResultOut)
def submit_lesson_attempt(
    lesson_id: int,
    payload: AttemptSubmitRequest,
    db: Session = Depends(get_db),
) -> AttemptResultOut:
    attempt, results = practice_service.submit_attempt(db, lesson_id, payload)
    return AttemptResultOut(
        attempt_id=attempt.id,
        lesson_id=attempt.lesson_id,
        score=attempt.score,
        total_questions=attempt.total_questions,
        correct_answers=attempt.correct_answers,
        submitted_at=attempt.submitted_at,
        results=results,
    )
