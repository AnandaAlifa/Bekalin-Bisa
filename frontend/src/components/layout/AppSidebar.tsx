import { NavLink } from 'react-router-dom';
import './AppSidebar.css';

const SIDEBAR_ITEMS = [
  { to: '/subjects', label: 'Materi', icon: 'book' },
  { to: '/lessons/1/practice', label: 'Praktik', icon: 'flask' },
  { to: '/', label: 'Dashboard', icon: 'home', end: true },
];

const ICON_PATHS: Record<string, string> = {
  home: 'M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V10.5z',
  book: 'M4 4h7a3 3 0 013 3v14a2.5 2.5 0 00-2.5-2.5H4V4zm16 0h-7a3 3 0 00-3 3v14a2.5 2.5 0 012.5-2.5H20V4z',
  flask: 'M9 3h6M10 3v6.5L4.5 19a2 2 0 001.8 3h11.4a2 2 0 001.8-3L14 9.5V3',
};

export default function AppSidebar() {
  return (
    <aside className="app-sidebar" aria-label="Menu navigasi sidebar">
      <p className="app-sidebar__heading">Menu Pintara</p>
      <nav className="app-sidebar__nav">
        {SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`
            }
          >
            <span className="app-sidebar__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d={ICON_PATHS[item.icon]}
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
