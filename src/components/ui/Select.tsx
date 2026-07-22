import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, error, className = '', ...props }, ref) => {
    return (
      <div className={`form-control ${error ? 'form-control-error' : ''} ${className}`}>
        {label && <label className="form-label">{label}</label>}
        <select ref={ref} className="form-select" {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="form-error-msg">{error}</p>}
        {!error && helperText && <p className="form-helper-text">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
