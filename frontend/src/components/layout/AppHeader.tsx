import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import './AppHeader.css';

export default function AppHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/subjects" className="app-header__brand">
          <img src="/logo.jpg" alt="" className="app-header__brand-logo" width={36} height={36} />
          <span className="app-header__brand-text">
            BEKA<span className="app-header__brand-accent">LIN</span>
          </span>
        </Link>

        <span className="app-header__badge badge badge--pink">
          {user.schoolName} ({user.sourceMode})
        </span>

        <button
          type="button"
          className="app-header__profile"
          onClick={() => navigate('/profil')}
          aria-label="Buka profil"
        >
          <span className="app-header__profile-text">
            <span className="app-header__profile-name">{user.name}</span>
            <span className="app-header__profile-role">
              {user.className} • <span className="app-header__role-highlight">{user.role}</span>
            </span>
          </span>
          <Avatar name={user.name} size={40} />
        </button>
      </div>
    </header>
  );
}
