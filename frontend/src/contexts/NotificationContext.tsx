import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import NotificationModal from '../components/common/NotificationModal';

export type NotificationType = 'info' | 'success' | 'error';

interface NotificationState {
  title: string;
  message: string;
  type: NotificationType;
  onConfirm?: (() => void) | null;
  visible: boolean;
  closing: boolean;
}

interface NotificationContextValue {
  showNotification: (
    title: string,
    message: string,
    type?: NotificationType,
    onConfirm?: () => void,
  ) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotificationState>({
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    visible: false,
    closing: false,
  });

  const showNotification = useCallback(
    (title: string, message: string, type: NotificationType = 'info', onConfirm?: () => void) => {
      setState({ title, message, type, onConfirm: onConfirm ?? null, visible: true, closing: false });
    },
    [],
  );

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, closing: true }));
    window.setTimeout(() => {
      setState((prev) => {
        prev.onConfirm?.();
        return { ...prev, visible: false, closing: false, onConfirm: null };
      });
    }, 300);
  }, []);

  const value = useMemo(() => ({ showNotification }), [showNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {state.visible && (
        <NotificationModal
          title={state.title}
          message={state.message}
          type={state.type}
          closing={state.closing}
          onClose={handleClose}
        />
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
