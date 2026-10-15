import { useNotification } from '../contexts/NotificationContext';
import './TeacherPage.css';

export default function TeacherPage() {
  const { showNotification } = useNotification();

  return (
    <div className="page-container teacher-page">
      <div className="bekalin-box teacher-header animate-pop-in">
        <div>
          <h1 className="page-title">PANEL GURU: Tambah Ujian & Edit</h1>
          <p className="page-subtitle teacher-header__sub">
            Kelola soal ujian, input nilai, dan materi pembelajaran.
          </p>
        </div>
        <button
          type="button"
          className="bekalin-button teacher-header__cta"
          onClick={() =>
            showNotification('Tambah Ujian', 'Membuka form penambahan ujian baru.', 'success')
          }
        >
          <i className="fa-solid fa-plus" /> Tambah Ujian Baru
        </button>
      </div>

      <div className="teacher-grid">
        <div className="bekalin-box teacher-card animate-pop-in stagger-1">
          <h3 className="teacher-card__title">Tambah Ujian</h3>
          <p className="teacher-card__desc">
            Buat soal pilihan ganda atau esai baru untuk kelas.
          </p>
          <button
            type="button"
            className="bekalin-button teacher-card__cta"
            onClick={() => showNotification('Menu Ujian', 'Membuka editor ujian.', 'info')}
          >
            Buka Editor
          </button>
        </div>

        <div className="bekalin-box teacher-card animate-pop-in stagger-2">
          <h3 className="teacher-card__title">Lihat Hasil</h3>
          <p className="teacher-card__desc">Rekapitulasi nilai dan laporan ujian siswa.</p>
          <button
            type="button"
            className="bekalin-button teacher-card__cta"
            onClick={() => showNotification('Hasil Ujian', 'Menampilkan rekap nilai siswa.', 'info')}
          >
            Lihat Rekap
          </button>
        </div>

        <div className="bekalin-box teacher-card animate-pop-in stagger-3">
          <h3 className="teacher-card__title">Edit Materi</h3>
          <p className="teacher-card__desc">Perbarui modul bab dan kurikulum pelajaran.</p>
          <button
            type="button"
            className="bekalin-button teacher-card__cta"
            onClick={() => showNotification('Edit Materi', 'Membuka editor materi.', 'info')}
          >
            Edit Modul
          </button>
        </div>
      </div>
    </div>
  );
}
