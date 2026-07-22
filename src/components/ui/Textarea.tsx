import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', ...props }, ref) => {
    return (
      <div className={`form-control ${error ? 'form-control-error' : ''} ${className}`}>
        {label && <label className="form-label">{label}</label>}
        <textarea ref={ref} className="form-textarea" rows={4} {...props} />
        {error && <p className="form-error-msg">{error}</p>}
        {!error && helperText && <p className="form-helper-text">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
