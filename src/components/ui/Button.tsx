import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, className = '', children, ...props }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} ${isLoading ? 'btn-loading' : ''} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="spinner" /> : children}
    </button>
  );
}
