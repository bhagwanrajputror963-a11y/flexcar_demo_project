
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-8 right-8 z-50 min-w-[220px] max-w-xs px-5 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-toast-in
        ${type === 'success' ? 'bg-green-50 border-green-300 text-green-900' : 'bg-red-50 border-red-300 text-red-900'}`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    >
      <span className="flex-1 text-base font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <style jsx>{`
        .animate-toast-in {
          animation: toast-in 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes toast-in {
          0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
