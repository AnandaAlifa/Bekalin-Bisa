import { NavLink, useLocation } from 'react-router-dom';
import './AppBottomNav.css';

interface Props {
  onMoreClick: () => void;
  moreActive: boolean;
}

const NAV_ITEMS = [
  { to: '/subjects', label: 'Materi', icon: 'fa-book-open' },
  { to: '/lab', label: 'Praktik', icon: 'fa-flask' },
  { to: '/ujian', label: 'Ujian', icon: 'fa-file-pen' },
  { to: '/jadwal', label: 'Jadwal', icon: 'fa-calendar-days' },
];

export default function AppBottomNav({ onMoreClick, moreActive }: Props) {
  const location = useLocation();

  const isMoreActive =
    moreActive ||
    ['/konsul', '/profil', '/teacher', '/admin'].some((p) => location.pathname.startsWith(p));

  return (
    <nav className="app-bottom-nav" aria-label="Navigasi bawah">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`app-bottom-nav__item${isActive ? ' app-bottom-nav__item--active' : ''}`}
          >
            <i className={`fa-solid ${item.icon} app-bottom-nav__icon`} aria-hidden="true" />
            <span className="app-bottom-nav__label">{item.label}</span>
          </NavLink>
        );
      })}
      <button
        type="button"
        className={`app-bottom-nav__item app-bottom-nav__more${isMoreActive ? ' app-bottom-nav__item--active' : ''}`}
        onClick={onMoreClick}
        aria-label="Menu lainnya"
      >
        <i className="fa-solid fa-bars app-bottom-nav__icon" aria-hidden="true" />
        <span className="app-bottom-nav__label">Lainnya</span>
      </button>
    </nav>
  );
}
