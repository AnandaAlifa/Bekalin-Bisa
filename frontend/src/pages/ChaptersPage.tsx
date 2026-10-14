import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusView from '../components/common/StatusView';
import ChapterList from '../components/materials/ChapterList';
import { getChapters } from '../services/content';
import type { Chapter } from '../types/content';

export default function ChaptersPage() {
  const { subjectId } = useParams();
  const parsedId = Number(subjectId);
  const isValidId = Number.isInteger(parsedId) && parsedId > 0;

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isValidId) {
      setError('Mata pelajaran tidak ditemukan.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getChapters(parsedId, controller.signal)
      .then((data) => {
        setChapters(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat daftar bab.');
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [parsedId, isValidId, reloadKey]);

  return (
    <div className="page-container">
      <Link className="back-link" to="/subjects">
        ← Kembali ke mata pelajaran
      </Link>
      <h1 className="page-title">Daftar Bab</h1>
      <p className="page-subtitle">
        Pilih subbab untuk membaca materi dan membuka latihan.
      </p>
      <StatusView
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && chapters.length === 0}
        emptyMessage="Belum ada bab pada mata pelajaran ini."
        onRetry={() => setReloadKey((key) => key + 1)}
      >
        <ChapterList chapters={chapters} />
      </StatusView>
    </div>
  );
}
