import './Avatar.css';

interface AvatarProps {
  size?: number;
  withCamera?: boolean;
}

export default function Avatar({ size = 40, withCamera = false }: AvatarProps) {
  return (
    <span
      className={`avatar${withCamera ? ' avatar--with-camera' : ''}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" width={size} height={size} fill="none">
        <circle cx="20" cy="20" r="20" fill="#EADDFF" />
        <circle cx="20" cy="16" r="6" fill="#4F378A" />
        <path
          d="M20 24c-6.5 0-12 3.9-14.1 9.3.5.5 1.1 1 1.7 1.5C9.2 29.8 14.4 26.2 20 26.2s10.8 3.6 12.4 8.6c.6-.5 1.2-1 1.7-1.5C32 27.9 26.5 24 20 24z"
          fill="#4F378A"
        />
      </svg>
      {withCamera && (
        <span className="avatar__camera" aria-hidden="true">
          <svg viewBox="0 0 16 16" width={13} height={13} fill="none">
            <rect
              x="2"
              y="4"
              width="12"
              height="9"
              rx="1.5"
              stroke="#1E1E1E"
              strokeWidth="1"
            />
            <circle cx="8" cy="8.5" r="2.2" stroke="#1E1E1E" strokeWidth="1" />
            <path d="M5.5 4L6.3 2.5h3.4L10.5 4" stroke="#1E1E1E" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </span>
  );
}
