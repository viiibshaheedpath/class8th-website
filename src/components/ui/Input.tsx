import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className={`form-control ${error ? 'form-control-error' : ''} ${className}`}>
        {label && <label className="form-label">{label}</label>}
        <input ref={ref} type={type} className="form-input" {...props} />
        {error && <p className="form-error-msg">{error}</p>}
        {!error && helperText && <p className="form-helper-text">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
