import { Link } from 'react-router-dom';
import type { Subject } from '../../types/content';
import './SubjectCard.css';

export default function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link className="subject-card" to={`/subjects/${subject.id}`}>
      <span className="subject-card__accent" aria-hidden="true" />
      <h2 className="subject-card__title">{subject.name}</h2>
      {subject.description && (
        <p className="subject-card__description">{subject.description}</p>
      )}
      <span className="subject-card__cta">Lihat bab →</span>
    </Link>
  );
}
