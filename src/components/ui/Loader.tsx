import React from 'react';

export function Loader({ className = '' }: { className?: string }) {
  return (
    <div className={`loader-container ${className}`}>
      <span className="spinner" />
    </div>
  );
}
