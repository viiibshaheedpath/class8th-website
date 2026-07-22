import React from 'react';

interface AlertProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ type = 'info', title, children, className = '' }: AlertProps) {
  return (
    <div className={`alert alert-${type} ${className}`} role="alert">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {title && <strong style={{ fontSize: '0.95rem', fontWeight: 600 }}>{title}</strong>}
        <div style={{ fontSize: '0.9rem' }}>{children}</div>
      </div>
    </div>
  );
}
