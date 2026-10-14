export interface PracticeQuestion {
  id: number;
  question_text: string;
  options: string[];
}

export interface AnswerSubmission {
  question_id: number;
  selected_option: string;
}

export interface QuestionResult {
  question_id: number;
  selected_option: string;
  is_correct: boolean;
  correct_option: string;
  explanation: string | null;
}

export interface AttemptResult {
  attempt_id: number;
  lesson_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  submitted_at: string;
  results: QuestionResult[];
}
