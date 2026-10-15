import { NavLink } from 'react-router-dom';
import './AppHeader.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/subjects', label: 'Materi', end: false },
  { to: '/lessons/1/practice', label: 'Praktik', end: false },
];

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="page-container app-header__inner">
        <NavLink className="app-header__brand" to="/">
          PINTARA
        </NavLink>
        <span className="app-header__tagline">Belajar, Bertumbuh, Berprestasi</span>
        <nav className="app-header__nav" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `app-header__link${isActive ? ' app-header__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
