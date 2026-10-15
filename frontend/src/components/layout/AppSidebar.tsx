import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AppSidebar.css';

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const isStaff = user.role === 'teacher' || user.role === 'school_admin';
  const isAdmin = user.role === 'school_admin';

  const mainItems = [
    { to: '/subjects', label: 'MATERI', icon: 'fa-book-open' },
    { to: '/lab', label: 'PRAKTIK & LAB', icon: 'fa-flask' },
    { to: '/ujian', label: 'UJIAN / TES', icon: 'fa-file-pen' },
    { to: '/jadwal', label: 'JADWAL', icon: 'fa-calendar-days' },
    { to: '/konsul', label: 'KONSULTASI', icon: 'fa-comments' },
    { to: '/profil', label: 'PROFIL SAYA', icon: 'fa-user' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="app-sidebar" aria-label="Menu navigasi sidebar">
      <p className="app-sidebar__heading">Menu Bekalin Bisa</p>
      <nav className="app-sidebar__nav">
        {mainItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`
            }
          >
            <i className={`fa-solid ${item.icon} app-sidebar__icon`} aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {isStaff && (
          <div className="app-sidebar__section">
            <p className="app-sidebar__section-heading">Panel Guru</p>
            <NavLink
              to="/teacher"
              className={({ isActive }) =>
                `app-sidebar__link app-sidebar__link--staff${isActive ? ' app-sidebar__link--active-staff' : ''}`
              }
            >
              <i className="fa-solid fa-chalkboard-user app-sidebar__icon" aria-hidden="true" />
              <span>TAMBAH UJIAN / EDIT</span>
            </NavLink>
          </div>
        )}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `app-sidebar__link app-sidebar__link--staff${isActive ? ' app-sidebar__link--active-staff' : ''}`
            }
          >
            <i className="fa-solid fa-shield-halved app-sidebar__icon" aria-hidden="true" />
            <span>MENU ADMIN</span>
          </NavLink>
        )}

        <div className="app-sidebar__logout">
          <button type="button" className="app-sidebar__logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket app-sidebar__icon" aria-hidden="true" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
