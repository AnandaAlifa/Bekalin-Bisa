import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusView from '../common/StatusView';
import { getLessons } from '../../services/content';
import type { Chapter, LessonListItem } from '../../types/content';
import './ChapterList.css';

interface ChapterListProps {
  chapters: Chapter[];
}

export default function ChapterList({ chapters }: ChapterListProps) {
  return (
    <ol className="chapter-list">
      {chapters.map((chapter, index) => (
        <ChapterItem key={chapter.id} chapter={chapter} index={index} />
      ))}
    </ol>
  );
}

function ChapterItem({ chapter, index }: { chapter: Chapter; index: number }) {
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getLessons(chapter.id, controller.signal)
      .then((data) => {
        setLessons(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat daftar materi.');
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [chapter.id, reloadKey]);

  return (
    <li
      className={`chapter-item bekalin-box animate-pop-in stagger-${(index % 5) + 1}`}
    >
      <h2 className="chapter-item__title">
        Bab {chapter.sort_order}: {chapter.title}
      </h2>
      <StatusView
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && lessons.length === 0}
        emptyMessage="Belum ada materi pada bab ini."
        onRetry={() => setReloadKey((key) => key + 1)}
      >
        <ul className="chapter-item__lessons">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link className="lesson-link" to={`/lessons/${lesson.id}`}>
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      </StatusView>
    </li>
  );
}
