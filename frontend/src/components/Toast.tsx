import React from 'react';

type ToastItem = { id: number; message: string; type?: 'success' | 'error' };

export default function Toast({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || 'success'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
