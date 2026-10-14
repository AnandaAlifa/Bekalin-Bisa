import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusView from '../components/common/StatusView';
import { getPracticeQuestions, submitPracticeAttempt } from '../services/practice';
import type {
  AnswerSubmission,
  AttemptResult,
  PracticeQuestion,
} from '../types/practice';
import './PracticePage.css';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'] as const;

export default function PracticePage() {
  const { lessonId } = useParams();
  const parsedId = Number(lessonId);
  const isValidId = Number.isInteger(parsedId) && parsedId > 0;

  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const [selections, setSelections] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);

  useEffect(() => {
    if (!isValidId) {
      setError('Materi tidak ditemukan.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getPracticeQuestions(parsedId, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setQuestions(data);
        setSelections({});
        setResult(null);
        setSubmitError(null);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat soal.');
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [parsedId, isValidId, reloadKey]);

  const unansweredCount = useMemo(
    () => questions.filter((question) => !selections[question.id]).length,
    [questions, selections],
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || result) return;
    if (unansweredCount > 0) {
      setSubmitError(`Masih ada ${unansweredCount} soal yang belum dijawab.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    const answers: AnswerSubmission[] = questions.map((question) => ({
      question_id: question.id,
      selected_option: selections[question.id],
    }));

    try {
      const attempt = await submitPracticeAttempt(parsedId, answers);
      setResult(attempt);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : 'Gagal mengirim jawaban. Silakan coba lagi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, result, unansweredCount, questions, selections, parsedId]);

  const handleRetry = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  const handleRetake = useCallback(() => {
    setSelections({});
    setResult(null);
    setSubmitError(null);
  }, []);

  return (
    <div className="page-container practice-page">
      <Link className="back-link" to={`/lessons/${parsedId || ''}`}>
        ← Kembali ke materi
      </Link>

      <StatusView
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && questions.length === 0}
        emptyMessage="Materi ini belum memiliki soal latihan."
        onRetry={handleRetry}
      >
        {result && (
          <section className="practice-result" aria-live="polite">
            <h1 className="page-title">Hasil Latihan</h1>
            <div className="practice-result__summary">
              <p className="practice-result__score">{result.score}</p>
              <p className="practice-result__detail">
                {result.correct_answers} benar dari {result.total_questions} soal
              </p>
            </div>
            <ol className="practice-result__list">
              {result.results.map((item, index) => (
                <li
                  key={item.question_id}
                  className={`practice-result__item ${
                    item.is_correct
                      ? 'practice-result__item--correct'
                      : 'practice-result__item--wrong'
                  }`}
                >
                  <p className="practice-result__badge">
                    {item.is_correct ? 'Benar' : 'Salah'} — jawaban Anda:{' '}
                    {item.selected_option}
                    {!item.is_correct && ` · kunci: ${item.correct_option}`}
                  </p>
                  {item.explanation && (
                    <p className="practice-result__explanation">{item.explanation}</p>
                  )}
                  <span className="visually-hidden">Soal nomor {index + 1}</span>
                </li>
              ))}
            </ol>
            <div className="practice-result__actions">
              <button type="button" className="button button--primary" onClick={handleRetake}>
                Kerjakan ulang
              </button>
              <Link className="button button--secondary" to={`/lessons/${parsedId}`}>
                Kembali ke materi
              </Link>
            </div>
          </section>
        )}

        {!result && (
          <section className="practice-form">
            <h1 className="page-title">Latihan Soal</h1>
            <p className="page-subtitle">
              Pilih satu jawaban untuk setiap soal, lalu kirim.
            </p>

            <ol className="practice-form__questions">
              {questions.map((question, index) => (
                <li key={question.id} className="practice-question">
                  <h2 className="practice-question__text">
                    {index + 1}. {question.question_text}
                  </h2>
                  <div className="practice-question__options" role="radiogroup" aria-label={`Pilihan jawaban soal ${index + 1}`}>
                    {question.options.map((option, optionIndex) => {
                      const letter = OPTION_LABELS[optionIndex] ?? String(optionIndex);
                      const isSelected = selections[question.id] === letter;
                      return (
                        <label
                          key={letter}
                          className={`practice-option ${
                            isSelected ? 'practice-option--selected' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={letter}
                            checked={isSelected}
                            onChange={() =>
                              setSelections((prev) => ({ ...prev, [question.id]: letter }))
                            }
                          />
                          <span className="practice-option__letter">{letter}</span>
                          <span className="practice-option__text">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ol>

            {submitError && (
              <p className="practice-form__error" role="alert">
                {submitError}
              </p>
            )}

            <div className="practice-form__footer">
              <button
                type="button"
                className="button button--primary"
                onClick={handleSubmit}
                disabled={isSubmitting || unansweredCount > 0}
              >
                {isSubmitting ? 'Mengirim…' : 'Kirim jawaban'}
              </button>
              {unansweredCount > 0 && !isSubmitting && (
                <p className="practice-form__hint">
                  {unansweredCount} soal belum terjawab
                </p>
              )}
            </div>
          </section>
        )}
      </StatusView>
    </div>
  );
}
