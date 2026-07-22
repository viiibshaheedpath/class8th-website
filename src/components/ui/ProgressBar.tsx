import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  showText?: boolean;
}

export function ProgressBar({ value, className = '', showText = false }: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`progress-bar-container ${className}`}>
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && <span className="progress-bar-text">{percentage}%</span>}
    </div>
  );
}
