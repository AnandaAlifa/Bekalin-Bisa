import { Link } from 'react-router-dom';
import type { Subject } from '../../types/content';
import './SubjectCard.css';

export default function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link className="subject-card bekalin-box animate-pop-in" to={`/subjects/${subject.id}`}>
      <div className="subject-card__header">
        <div className="subject-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path
              d="M4 4h7a3 3 0 013 3v14a2.5 2.5 0 00-2.5-2.5H4V4zm16 0h-7a3 3 0 00-3 3v14a2.5 2.5 0 012.5-2.5H20V4z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="badge badge--pink">Pelajaran</span>
      </div>
      <h2 className="subject-card__title">{subject.name}</h2>
      {subject.description && (
        <p className="subject-card__description">{subject.description}</p>
      )}
      <span className="subject-card__cta button button--primary">Buka Materi</span>
    </Link>
  );
}
