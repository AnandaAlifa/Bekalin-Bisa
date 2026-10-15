import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import './AppHeader.css';

export default function AppHeader() {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="app-header__brand">
          <img src="/logo.jpg" alt="" className="app-header__brand-logo" width={36} height={36} />
          <span className="app-header__brand-text">
            BEKA<span className="app-header__brand-accent">LIN</span>
          </span>
        </Link>

        <span className="app-header__badge badge badge--pink">Platform Pembelajaran</span>

        <button
          type="button"
          className="app-header__profile"
          onClick={() => navigate('/subjects')}
          aria-label="Buka profil / materi"
        >
          <span className="app-header__profile-text">
            <span className="app-header__profile-name">Siswa</span>
            <span className="app-header__profile-role">Belajar, Bertumbuh, Berprestasi</span>
          </span>
          <Avatar name="Siswa" size={40} />
        </button>
      </div>
    </header>
  );
}
