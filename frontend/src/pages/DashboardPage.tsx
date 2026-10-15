import { Link } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <div className="page-container dashboard-page">
      <h1 className="page-title">Selamat datang di PINTARA</h1>
      <p className="page-subtitle">
        Mulai dari materi belajar, lalu uji pemahamanmu lewat latihan soal.
      </p>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2 className="dashboard-card__title">Materi</h2>
          <p className="dashboard-card__description">
            Jelajahi mata pelajaran, bab, dan subbab. Setiap materi dilengkapi
            isi belajar dan catatan penting.
          </p>
          <Link className="button button--primary" to="/subjects">
            Buka Materi
          </Link>
        </section>

        <section className="dashboard-card">
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
