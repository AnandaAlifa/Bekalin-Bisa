import { useEffect, useState } from 'react';
import StatusView from '../components/common/StatusView';
import SubjectCard from '../components/materials/SubjectCard';
import { getSubjects } from '../services/content';
import type { Subject } from '../types/content';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    getSubjects(controller.signal)
      .then((data) => {
        setSubjects(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : 'Gagal memuat daftar mata pelajaran.',
        );
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  return (
    <div className="page-container">
      <h1 className="page-title">Mata Pelajaran</h1>
      <p className="page-subtitle">Pilih mata pelajaran untuk mulai belajar.</p>
      <StatusView
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && subjects.length === 0}
        emptyMessage="Belum ada mata pelajaran tersedia."
        onRetry={() => setReloadKey((key) => key + 1)}
      >
        <div className="card-grid">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </StatusView>
    </div>
  );
}
