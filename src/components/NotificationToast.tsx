import React, { useEffect, useState } from 'react';
import { CheckCircleOutlined, InfoCircleOutlined, WarningOutlined, CloseOutlined, BellOutlined } from '@ant-design/icons';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: string;
}

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger slide-in
    requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss after 4s
    const timer = setTimeout(() => dismiss(), 4000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 350);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'TASK_ASSIGNED':
        return <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0"><InfoCircleOutlined className="text-white text-[16px]" /></div>;
      case 'TASK_COMPLETED':
        return <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shrink-0"><CheckCircleOutlined className="text-white text-[16px]" /></div>;
      case 'TASK_APPROVED':
        return <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><CheckCircleOutlined className="text-white text-[16px]" /></div>;
      case 'TASK_REJECTED':
        return <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center shrink-0"><WarningOutlined className="text-white text-[16px]" /></div>;
      default:
        return <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center shrink-0"><BellOutlined className="text-white text-[16px]" /></div>;
    }
  };

  return (
    <div
      style={{
        transform: visible && !exiting ? 'translateY(0)' : 'translateY(-120%)',
        opacity: visible && !exiting ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.32, 0, 0.67, 0), opacity 0.3s ease',
      }}
      className="flex items-center gap-3 bg-[#1c1c1e] rounded-2xl px-4 py-3 shadow-2xl shadow-black/40 border border-white/10 max-w-[calc(100vw-32px)] w-full"
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-white text-[13px] font-black m-0 truncate">{toast.title}</p>
        <p className="text-gray-400 text-[11px] m-0 line-clamp-1 mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={dismiss}
        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border-none shrink-0 active:scale-90 transition-transform"
      >
        <CloseOutlined className="text-gray-400 text-[10px]" />
      </button>
    </div>
  );
};

// ─── Global Toast Manager ────────────────────────────────────────────
let _addToast: ((toast: ToastNotification) => void) | null = null;

export const showNotificationToast = (toast: Omit<ToastNotification, 'id'>) => {
  if (_addToast) {
    _addToast({ ...toast, id: Date.now().toString() });
  }
};

export const NotificationToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    _addToast = (toast) => {
      setToasts(prev => [toast, ...prev].slice(0, 3)); // max 3 stacked
    };
    return () => { _addToast = null; };
  }, []);

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(var(--zaui-safe-area-inset-top, 24px) + 8px)',
        left: '16px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={toast} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
};
