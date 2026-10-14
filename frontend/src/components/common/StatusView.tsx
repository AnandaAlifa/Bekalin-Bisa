import type { ReactNode } from 'react';
import './StatusView.css';

interface StatusViewProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export default function StatusView({
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyMessage = 'Belum ada data tersedia.',
  onRetry,
  children,
}: StatusViewProps) {
  if (isLoading) {
    return (
      <div className="status-view status-view--loading" role="status">
        Memuat…
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-view status-view--error" role="alert">
        <p>{error}</p>
        {onRetry && (
          <button type="button" className="status-view__button" onClick={onRetry}>
            Coba lagi
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="status-view status-view--empty" role="status">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
