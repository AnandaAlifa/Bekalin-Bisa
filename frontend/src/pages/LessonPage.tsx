import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusView from '../components/common/StatusView';
import { getLesson } from '../services/content';
import type { LessonDetail } from '../types/content';
import './LessonPage.css';

export default function LessonPage() {
  const { lessonId } = useParams();
  const parsedId = Number(lessonId);
  const isValidId = Number.isInteger(parsedId) && parsedId > 0;

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isValidId) {
      setError('Materi tidak ditemukan.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getLesson(parsedId, controller.signal)
      .then((data) => {
        setLesson(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat materi.');
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [parsedId, isValidId, reloadKey]);

  return (
    <div className="page-container lesson-page">
      <Link className="back-link" to="/subjects">
        ← Kembali ke daftar mata pelajaran
      </Link>
      <StatusView
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && lesson === null}
        emptyMessage="Materi tidak tersedia."
        onRetry={() => setReloadKey((key) => key + 1)}
      >
        {lesson && (
          <article className="lesson-panel">
            <h1 className="page-title">{lesson.title}</h1>
            <div className="lesson-panel__content">{lesson.content}</div>
            {lesson.note && (
              <aside className="lesson-panel__note">
                <h2 className="lesson-panel__note-title">NOTE</h2>
                <p>{lesson.note}</p>
              </aside>
            )}
            <p className="lesson-panel__practice">
              <Link className="button button--primary" to={`/lessons/${lesson.id}/practice`}>
                Mulai Latihan
              </Link>
            </p>
          </article>
        )}
      </StatusView>
    </div>
  );
}
