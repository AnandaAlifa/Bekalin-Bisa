export interface Subject {
  id: number;
  name: string;
  description: string | null;
}

export interface Chapter {
  id: number;
  title: string;
  sort_order: number;
}

export interface LessonListItem {
  id: number;
  title: string;
  sort_order: number;
}

export interface LessonDetail {
  id: number;
  chapter_id: number;
  title: string;
  content: string;
  note: string | null;
  sort_order: number;
}
