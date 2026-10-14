import { apiGet } from './api';
import type { Chapter, LessonDetail, LessonListItem, Subject } from '../types/content';

export function getSubjects(signal?: AbortSignal): Promise<Subject[]> {
  return apiGet<Subject[]>('/subjects', signal);
}

export function getChapters(
  subjectId: number,
  signal?: AbortSignal,
): Promise<Chapter[]> {
  return apiGet<Chapter[]>(`/subjects/${subjectId}/chapters`, signal);
}

export function getLessons(
  chapterId: number,
  signal?: AbortSignal,
): Promise<LessonListItem[]> {
  return apiGet<LessonListItem[]>(`/chapters/${chapterId}/lessons`, signal);
}

export function getLesson(
  lessonId: number,
  signal?: AbortSignal,
): Promise<LessonDetail> {
  return apiGet<LessonDetail>(`/lessons/${lessonId}`, signal);
}
