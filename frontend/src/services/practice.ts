import { apiGet, apiPost } from './api';
import type {
  AnswerSubmission,
  AttemptResult,
  PracticeQuestion,
} from '../types/practice';

export async function getPracticeQuestions(
  lessonId: number,
  signal?: AbortSignal,
): Promise<PracticeQuestion[]> {
  return apiGet<PracticeQuestion[]>(`/lessons/${lessonId}/questions`, signal);
}

export async function submitPracticeAttempt(
  lessonId: number,
  answers: AnswerSubmission[],
): Promise<AttemptResult> {
  return apiPost<AttemptResult>(`/lessons/${lessonId}/attempts`, { answers });
}
