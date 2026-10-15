import { NavLink } from 'react-router-dom';
import './AppBottomNav.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/subjects', label: 'Materi', icon: 'book' },
  { to: '/lessons/1/practice', label: 'Praktik', icon: 'quiz' },
];

const ICON_PATHS: Record<string, string> = {
  home: 'M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V10.5z',
  book: 'M4 4h7a3 3 0 013 3v14a2.5 2.5 0 00-2.5-2.5H4V4zm16 0h-7a3 3 0 00-3 3v14a2.5 2.5 0 012.5-2.5H20V4z',
  quiz: 'M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm3 4h10M7 12h6m-6 4h8',
};

export default function AppBottomNav() {
  return (
    <nav className="app-bottom-nav" aria-label="Navigasi bawah">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `app-bottom-nav__item${isActive ? ' app-bottom-nav__item--active' : ''}`
          }
        >
          <span className="app-bottom-nav__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path
                d={ICON_PATHS[item.icon]}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="app-bottom-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
