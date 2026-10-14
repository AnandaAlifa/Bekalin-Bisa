from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

OptionLetter = Literal["A", "B", "C", "D", "E"]


class QuestionOut(BaseModel):
    id: int
    question_text: str
    options: list[str]

    model_config = {"from_attributes": True}


class AnswerSubmission(BaseModel):
    question_id: int
    selected_option: OptionLetter


class AttemptSubmitRequest(BaseModel):
    answers: list[AnswerSubmission] = Field(min_length=1)


class QuestionResultOut(BaseModel):
    question_id: int
    selected_option: str
    is_correct: bool
    correct_option: str
    explanation: str | None = None


class AttemptResultOut(BaseModel):
    attempt_id: int
    lesson_id: int
    score: int
    total_questions: int
    correct_answers: int
    submitted_at: datetime
    results: list[QuestionResultOut]
