import { Link } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="page-container dashboard-page">
      <section className="dashboard-hero bekalin-box animate-pop-in">
        <div className="dashboard-hero__text">
          <h1 className="page-title">Selamat datang di BEKALIN BISA</h1>
          <p className="page-subtitle">
            Mulai dari materi belajar, lalu uji pemahamanmu lewat latihan soal.
          </p>
        </div>
        <span className="badge badge--pink">Belajar, Bertumbuh, Berprestasi</span>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-card bekalin-box animate-pop-in stagger-1">
          <div className="dashboard-card__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M4 4h7a3 3 0 013 3v14a2.5 2.5 0 00-2.5-2.5H4V4zm16 0h-7a3 3 0 00-3 3v14a2.5 2.5 0 012.5-2.5H20V4z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="dashboard-card__title">Materi</h2>
          <p className="dashboard-card__description">
            Jelajahi mata pelajaran, bab, dan subbab. Setiap materi dilengkapi
            isi belajar dan catatan penting.
          </p>
          <Link className="button button--primary" to="/subjects">
            Buka Materi
          </Link>
        </section>

        <section className="dashboard-card bekalin-box animate-pop-in stagger-2">
          <div className="dashboard-card__icon dashboard-card__icon--pink" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <path
                d="M9 3h6M10 3v6.5L4.5 19a2 2 0 001.8 3h11.4a2 2 0 001.8-3L14 9.5V3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="dashboard-card__title">Praktik</h2>
          <p className="dashboard-card__description">
            Kerjakan latihan pilihan ganda. Nilai dihitung oleh backend dan hasil
            tersimpan setiap kali kamu mengirim jawaban.
          </p>
          <Link className="button button--primary" to="/lessons/1/practice">
            Buka Praktik
          </Link>
          <p className="dashboard-card__hint">
            Latihan tersedia per materi — buka materi lalu pilih “Mulai Latihan”.
          </p>
        </section>
      </div>
    </div>
  );
}
