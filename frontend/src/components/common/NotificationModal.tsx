import type { NotificationType } from '../../contexts/NotificationContext';
import './NotificationModal.css';

interface Props {
  title: string;
  message: string;
  type: NotificationType;
  closing: boolean;
  onClose: () => void;
}

export default function NotificationModal({ title, message, type, closing, onClose }: Props) {
  const isError = type === 'error';

  return (
    <div
      className={`notif-overlay animate-fade-in${closing ? ' notif-overlay--closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`notif-modal animate-pop-in${closing ? ' notif-modal--closing' : ''}`}>
        <div className="notif-modal__header">
          <div className={`notif-modal__icon${isError ? ' notif-modal__icon--error' : ''}`}>
            <i className={`fa-solid ${isError ? 'fa-triangle-exclamation' : 'fa-circle-info'}`} />
          </div>
          <h3 className="notif-modal__title">{title}</h3>
        </div>
        <p className="notif-modal__message">{message}</p>
        <div className="notif-modal__actions">
          <button type="button" className="bekalin-button notif-modal__ok" onClick={onClose} autoFocus>
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
