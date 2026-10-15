import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import './UjianPage.css';

interface Exam {
  title: string;
  subject: string;
  duration: number;
}

const EXAMS: Exam[] = [
  { title: 'Ujian Kimia Semester Genap', subject: 'Kimia', duration: 90 },
  { title: 'Ujian Fisika Semester Genap', subject: 'Fisika', duration: 90 },
  { title: 'Ujian Matematika Semester Genap', subject: 'Matematika', duration: 90 },
  { title: 'Ujian Ekonomi Semester Genap', subject: 'Ekonomi', duration: 90 },
];

const QUESTION = {
  number: 1,
  total: 10,
  text: 'Berapakah percepatan gravitasi standar bumi yang digunakan dalam perhitungan fisika dasar?',
  options: ['A. 9.8 m/s²', 'B. 10 m/s²', 'C. 8.9 m/s²', 'D. 9.1 m/s²'],
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} Menit`;
}

export default function UjianPage() {
  const { showNotification } = useNotification();
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [isExamLocked, setIsExamLocked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [, setViolations] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleViolation = useCallback(() => {
    if (!activeExam) return;
    setViolations((v) => {
      const next = v + 1;
      if (next >= 1) setIsExamLocked(true);
      return next;
    });
  }, [activeExam]);

  useEffect(() => {
    if (!activeExam || isExamLocked) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const onVisibility = () => {
      if (document.hidden) handleViolation();
    };
    const onBlur = () => handleViolation();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
    };
  }, [activeExam, isExamLocked, handleViolation]);

  const startExam = (exam: Exam) => {
    setActiveExam(exam);
    setIsExamLocked(false);
    setSelectedAnswer(null);
    setViolations(0);
    setTimeLeft(45 * 60);
  };

  const exitExam = () => {
    setActiveExam(null);
    setIsExamLocked(false);
    setSelectedAnswer(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const submitExam = () => {
    const examTitle = activeExam?.title || 'Ujian';
    exitExam();
    showNotification(
      'Ujian Selesai',
      'Jawaban Anda telah berhasil dikirim dan dinilai.',
      'success',
    );
    void examTitle;
  };

  const unlockExam = () => {
    setIsExamLocked(false);
    setActiveExam(null);
    setViolations(0);
  };

  if (isExamLocked) {
    return (
      <div className="exam-lockdown animate-fade-in">
        <div className="exam-lockdown__card animate-pop-in">
          <div className="exam-lockdown__icon">
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <h2 className="exam-lockdown__title">UJIAN DIBLOKIR: Pelanggaran Terdeteksi!</h2>
          <p className="exam-lockdown__msg">
            Anda terdeteksi mencoba meninggalkan halaman ujian atau keluar dari mode layar
            penuh (Managed Exam Lockdown). Akses ujian ditangguhkan.
          </p>
          <button type="button" className="exam-lockdown__report" onClick={unlockExam}>
            Lapor ke Admin Sekolah / Guru Pengampu
          </button>
        </div>
      </div>
    );
  }

  if (activeExam) {
    return (
      <div className="page-container ujian-active">
        <div className="bekalin-box ujian-active__header animate-pop-in">
          <div>
            <span className="ujian-badge-locked">Mode Ujian Terkunci Aktif</span>
            <h1 className="ujian-active__title">{activeExam.title}</h1>
          </div>
          <div className="ujian-active__timer">
            <p className="ujian-active__timer-label">Sisa Waktu</p>
            <p className="ujian-active__timer-value">{formatTime(timeLeft)}</p>
          </div>
        </div>

        <div className="bekalin-box ujian-question animate-pop-in stagger-1">
          <div>
            <span className="ujian-question__number">
              Soal Nomor {QUESTION.number} dari {QUESTION.total}
            </span>
            <p className="ujian-question__text">{QUESTION.text}</p>
          </div>
          <div className="ujian-options">
            {QUESTION.options.map((opt) => (
              <label
                key={opt}
                className={`ujian-option${selectedAnswer === opt ? ' ujian-option--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="jawaban"
                  className="ujian-option__radio"
                  checked={selectedAnswer === opt}
                  onChange={() => setSelectedAnswer(opt)}
                />
                <span className="ujian-option__text">{opt}</span>
              </label>
            ))}
          </div>
          <div className="ujian-question__actions">
            <button type="button" className="ujian-exit-btn" onClick={exitExam}>
              Keluar
            </button>
            <button type="button" className="bekalin-button ujian-submit" onClick={submitExam}>
              Kirim Jawaban
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container ujian-page">
      <div className="bekalin-box animate-pop-in" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">UJIAN TULIS & PENILAIAN</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Daftar mata pelajaran ujian dan asesmen nasional.
        </p>
      </div>

      <div className="ujian-grid">
        {EXAMS.map((exam, idx) => (
          <div key={exam.title} className={`bekalin-box ujian-card animate-pop-in stagger-${(idx % 4) + 1}`}>
            <div>
              <span className="badge badge--pink">Wajib Dikerjakan</span>
              <h3 className="ujian-card__title">{exam.title}</h3>
              <p className="ujian-card__meta">
                Durasi: {exam.duration} Menit | Sistem Penguncian Layar Aktif
              </p>
            </div>
            <button
              type="button"
              className="bekalin-button ujian-card__cta"
              onClick={() => startExam(exam)}
            >
              <i className="fa-solid fa-lock" /> Mulai Ujian (Mode Terkunci)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
