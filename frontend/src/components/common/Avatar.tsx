import './Avatar.css';

interface AvatarProps {
  name?: string;
  size?: number;
  className?: string;
}

function getInitial(name?: string): string {
  if (!name) return 'U';
  const trimmed = name.trim();
  if (!trimmed) return 'U';
  return trimmed.charAt(0).toUpperCase();
}

export default function Avatar({ name = 'User', size = 40, className = '' }: AvatarProps) {
  return (
    <span
      className={`avatar ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      aria-hidden="true"
    >
      {getInitial(name)}
    </span>
  );
}
