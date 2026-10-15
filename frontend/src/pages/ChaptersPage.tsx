import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusView from '../components/common/StatusView';
import ChapterList from '../components/materials/ChapterList';
import { getChapters, getSubjects } from '../services/content';
import type { Chapter, Subject } from '../types/content';
import { useNotification } from '../contexts/NotificationContext';
import './ChaptersPage.css';

const NOTE_KEY = (id: string) => `bekalin.note.${id}`;

export default function ChaptersPage() {
  const { subjectId } = useParams();
  const parsedId = Number(subjectId);
  const isValidId = Number.isInteger(parsedId) && parsedId > 0;

  const { showNotification } = useNotification();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isValidId) {
      setError('Mata pelajaran tidak ditemukan.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    Promise.all([
      getChapters(parsedId, controller.signal),
      getSubjects(controller.signal),
    ])
      .then(([chapterData, subjects]) => {
        setChapters(chapterData);
        setSubject(subjects.find((s) => s.id === parsedId) ?? null);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat daftar bab.');
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [parsedId, isValidId, reloadKey]);

  useEffect(() => {
    try {
      setNote(localStorage.getItem(NOTE_KEY(String(parsedId))) || '');
    } catch {
      setNote('');
    }
  }, [parsedId]);

  const handleSaveNote = () => {
    try {
      localStorage.setItem(NOTE_KEY(String(parsedId)), note);
    } catch {
      /* ignore */
    }
    showNotification('Catatan Disimpan', 'Catatan pribadi Anda berhasil disimpan.', 'success');
  };

  return (
    <div className="page-container chapters-page">
      <Link className="back-link" to="/subjects">
        <i className="fa-solid fa-arrow-left" /> Kembali ke Daftar Materi
      </Link>

      <div className="bekalin-box chapters-header animate-pop-in">
        <h1 className="page-title">{subject?.name || 'Daftar Bab'}</h1>
        {subject?.description && (
          <p className="page-subtitle chapters-header__desc">{subject.description}</p>
        )}
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Pilih subbab untuk membaca materi dan membuka latihan.
        </p>
      </div>

      <StatusView
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && chapters.length === 0}
        emptyMessage="Belum ada bab pada mata pelajaran ini."
        onRetry={() => setReloadKey((key) => key + 1)}
      >
        <div className="chapters-body">
          <h3 className="chapters-body__heading">Daftar Bab & Sub-Bab:</h3>
          <ChapterList chapters={chapters} />

          <div className="chapters-note animate-pop-in">
            <h3 className="chapters-note__heading">
              <i className="fa-solid fa-note-sticky" /> NOTE / Catatan Pribadi:
            </h3>
            <textarea
              rows={3}
              placeholder="Tulis catatan penting Anda di sini..."
              className="form-input chapters-note__textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button type="button" className="bekalin-button chapters-note__save" onClick={handleSaveNote}>
              Simpan Catatan
            </button>
          </div>
        </div>
      </StatusView>
    </div>
  );
}
