import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export function Card({ title, subtitle, className = '', children, ...props }: CardProps) {
  return (
    <div className={`card ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
}
