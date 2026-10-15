import { useAuth } from '../contexts/AuthContext';
import './AdminPage.css';

export default function AdminPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page-container admin-page">
      <div className="bekalin-box animate-pop-in" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">MENU ADMIN SEKOLAH</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Konfigurasi sistem, akun guru, dan pengaturan platform Bekalin Bisa.
        </p>
      </div>

      <div className="bekalin-box admin-card animate-pop-in stagger-1">
        <h3 className="admin-card__title">Manajemen Hak Akses Sekolah</h3>
        <div className="admin-status">
          <div>
            <p className="admin-status__mode">
              Status Sumber Materi: <span className="admin-status__mode-value">{user.sourceMode}</span>
            </p>
            <p className="admin-status__desc">
              Sinkronisasi data sekolah dengan pusat terverifikasi.
            </p>
          </div>
          <span className="admin-status__badge">Aktif Resmi</span>
        </div>
      </div>
    </div>
  );
}
