import { useNotification } from '../contexts/NotificationContext';
import './KonsulPage.css';

export default function KonsulPage() {
  const { showNotification } = useNotification();

  return (
    <div className="page-container konsul-page">
      <div className="bekalin-box animate-pop-in" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">KONSULTASI & KARIER</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Layanan BK, tes minat bakat, dan informasi magang vokasi.
        </p>
      </div>

      <div className="konsul-grid">
        <div className="bekalin-box konsul-card animate-pop-in stagger-1">
          <div>
            <div className="konsul-card__icon konsul-card__icon--indigo">
              <i className="fa-solid fa-compass" />
            </div>
            <h3 className="konsul-card__title">Tes Minat Bakat</h3>
            <p className="konsul-card__desc">
              Temukan rekomendasi penjurusan kuliah dan karier masa depan berdasarkan survei
              psikometri tervalidasi.
            </p>
          </div>
          <button
            type="button"
            className="bekalin-button konsul-card__cta"
            onClick={() =>
              showNotification(
                'Survei Minat',
                'Modul survei minat dan bakat akan segera dimuat.',
                'info',
              )
            }
          >
            Mulai Tes Minat
          </button>
        </div>

        <div className="bekalin-box konsul-card animate-pop-in stagger-2">
          <div>
            <div className="konsul-card__icon konsul-card__icon--pink">
              <i className="fa-solid fa-briefcase" />
            </div>
            <h3 className="konsul-card__title">Info Magang Vokasi</h3>
            <p className="konsul-card__desc">
              Informasi lowongan magang industri resmi mitra perusahaan untuk siswa.
            </p>
          </div>
          <button
            type="button"
            className="bekalin-button konsul-card__cta"
            onClick={() =>
              showNotification(
                'Katalog Magang',
                'Menampilkan daftar mitra industri dan lowongan magang aktif.',
                'info',
              )
            }
          >
            Lihat Lowongan Magang
          </button>
        </div>
      </div>
    </div>
  );
}
