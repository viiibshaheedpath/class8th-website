import React, { useEffect } from 'react';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps extends ToastItem {
  onClose: (id: string) => void;
}

export function Toast({ id, message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button 
        onClick={() => onClose(id)} 
        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1.25rem', lineHeight: 1 }}
      >
        &times;
      </button>
    </div>
  );
}
