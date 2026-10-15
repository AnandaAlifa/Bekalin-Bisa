import { Link } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="page-container dashboard-page">
      <div className="dashboard-hero panel">
        <Avatar size={56} withCamera />
        <div className="dashboard-hero__text">
          <h1 className="page-title">Selamat datang di PINTARA</h1>
          <p className="page-subtitle">
            Mulai dari materi belajar, lalu uji pemahamanmu lewat latihan soal.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card panel">
          <h2 className="dashboard-card__title">Materi</h2>
          <div className="dashboard-card__preview blue-overlay" aria-hidden="true">
            <span className="dashboard-card__preview-line" />
            <span className="dashboard-card__preview-line dashboard-card__preview-line--short" />
          </div>
          <p className="dashboard-card__description">
            Jelajahi mata pelajaran, bab, dan subbab. Setiap materi dilengkapi
            isi belajar dan catatan penting.
          </p>
          <Link className="button button--primary" to="/subjects">
            Buka Materi
          </Link>
        </section>

        <section className="dashboard-card panel">
          <h2 className="dashboard-card__title">Praktik</h2>
          <div className="dashboard-card__preview magenta-bar" aria-hidden="true">
            <span className="dashboard-card__preview-line" />
            <span className="dashboard-card__preview-line dashboard-card__preview-line--short" />
          </div>
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
