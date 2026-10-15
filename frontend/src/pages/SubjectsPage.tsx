import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusView from '../components/common/StatusView';
import { getSubjects } from '../services/content';
import type { Subject } from '../types/content';
import { useAuth } from '../contexts/AuthContext';
import './SubjectsPage.css';

const SUBJECT_META: Record<string, { icon: string; cat: string; labId?: string }> = {
  matematika: { icon: 'fa-square-root-variable', cat: 'Eksak' },
  fisika: { icon: 'fa-atom', cat: 'Sains', labId: 'fisika' },
  biologi: { icon: 'fa-dna', cat: 'Sains', labId: 'biologi' },
  kimia: { icon: 'fa-flask', cat: 'Sains', labId: 'kimia' },
  ekonomi: { icon: 'fa-coins', cat: 'Sosial' },
  sejarah: { icon: 'fa-landmark', cat: 'Sosial' },
  geografi: { icon: 'fa-earth-asia', cat: 'Sosial' },
  sosiologi: { icon: 'fa-people-group', cat: 'Sosial' },
  bahasa: { icon: 'fa-language', cat: 'Umum' },
  inggris: { icon: 'fa-comments', cat: 'Umum' },
  agama: { icon: 'fa-book-quran', cat: 'Umum' },
  informatika: { icon: 'fa-code', cat: 'Eksak' },
  astronomi: { icon: 'fa-meteor', cat: 'Sains', labId: 'astronomi' },
};

function metaFor(name: string): { icon: string; cat: string; labId?: string } {
  const lower = name.toLowerCase();
  for (const [key, meta] of Object.entries(SUBJECT_META)) {
    if (lower.includes(key)) return meta;
  }
  return { icon: 'fa-book-open', cat: 'Pelajaran' };
}

export default function SubjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [classGrade, setClassGrade] = useState('11');

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

  const className = user?.className || 'Kelas 11 IPA 2';

  const enriched = useMemo(
    () => subjects.map((s) => ({ ...s, meta: metaFor(s.name) })),
    [subjects],
  );

  return (
    <div className="page-container subjects-page">
      <div className="bekalin-box subjects-header animate-pop-in">
        <div>
          <h1 className="page-title">MATERI PEMBELAJARAN</h1>
          <p className="page-subtitle subjects-header__sub">
            Jenjang: <span className="subjects-header__grade">{className}</span> | Bekalin Bisa Platform
          </p>
        </div>
        <div className="subjects-header__grade-select">
          <span className="subjects-header__grade-label">Pilih Kelas:</span>
          <select
            className="subjects-header__select"
            value={classGrade}
            onChange={(e) => setClassGrade(e.target.value)}
            aria-label="Pilih kelas"
          >
            <option value="10">SMA Kelas 10</option>
            <option value="11">SMA Kelas 11</option>
            <option value="12">SMA/SMK Kelas 12</option>
          </select>
        </div>
      </div>

      <StatusView
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && subjects.length === 0}
        emptyMessage="Belum ada mata pelajaran tersedia."
        onRetry={() => setReloadKey((key) => key + 1)}
      >
        <div className="subjects-grid">
          {enriched.map((subject, idx) => (
            <div
              key={subject.id}
              className={`bekalin-box subject-item animate-pop-in stagger-${(idx % 6) + 1}`}
            >
              <div className="subject-item__top">
                <div className="subject-item__icon" aria-hidden="true">
                  <i className={`fa-solid ${subject.meta.icon}`} />
                </div>
                <span className="badge badge--pink">{subject.meta.cat}</span>
              </div>
              <h3 className="subject-item__title">{subject.name}</h3>
              {subject.description && (
                <p className="subject-item__desc">{subject.description}</p>
              )}
              <div className="subject-item__actions">
                <button
                  type="button"
                  className="bekalin-button subject-item__cta"
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                >
                  Buka Materi
                </button>
                {subject.meta.labId && (
                  <Link
                    to={`/lab?subject=${subject.meta.labId}`}
                    className="subject-item__lab-btn"
                  >
                    Mulai Praktikin Lab
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </StatusView>
    </div>
  );
}
