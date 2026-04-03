import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 text-sm
          border-2 border-border rounded-sm
          bg-bg-primary text-text-primary
          placeholder:text-text-secondary
          focus-ring focus:border-border-focus
          transition-colors
          ${error ? 'border-danger' : ''}
          ${className}
        `}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
