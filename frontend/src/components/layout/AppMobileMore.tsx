import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AppMobileMore.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppMobileMore({ isOpen, onClose }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen || !user) return null;

  const isStaff = user.role === 'teacher' || user.role === 'school_admin';
  const isAdmin = user.role === 'school_admin';

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login');
  };

  return (
    <div
      className="mobile-more-overlay animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mobile-more-sheet animate-slide-up">
        <div className="mobile-more-sheet__header">
          <h3 className="mobile-more-sheet__title">Menu Tambahan Bekalin</h3>
          <button type="button" className="mobile-more-sheet__close" onClick={onClose} aria-label="Tutup">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <button type="button" className="mobile-more-item mobile-more-item--indigo" onClick={() => go('/konsul')}>
          <i className="fa-solid fa-comments mobile-more-item__icon" />
          <span>KONSULTASI & KARIER</span>
        </button>

        <button type="button" className="mobile-more-item mobile-more-item--indigo" onClick={() => go('/profil')}>
          <i className="fa-solid fa-user mobile-more-item__icon" />
          <span>PROFIL SAYA</span>
        </button>

        {isStaff && (
          <button type="button" className="mobile-more-item mobile-more-item--pink" onClick={() => go('/teacher')}>
            <i className="fa-solid fa-chalkboard-user mobile-more-item__icon" />
            <span>PANEL GURU (TAMBAH UJIAN)</span>
          </button>
        )}

        {isAdmin && (
          <button type="button" className="mobile-more-item mobile-more-item--purple" onClick={() => go('/admin')}>
            <i className="fa-solid fa-shield-halved mobile-more-item__icon" />
            <span>MENU ADMIN SEKOLAH</span>
          </button>
        )}

        <button type="button" className="mobile-more-item mobile-more-item--logout" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket mobile-more-item__icon" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </div>
  );
}
