import type { ReactNode } from 'react';

interface AdminFormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export default function AdminFormField({ label, htmlFor, required, error, hint, children, className = '' }: AdminFormFieldProps) {
  return (
    <div className={`mb-5 ${className}`}>
      <label htmlFor={htmlFor} className="label-lux block mb-1.5">
        {label} {required && <span className="text-[#DC2626]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[0.6rem] text-[#6B6355] mt-1">{hint}</p>}
      {error && <p className="text-[0.6rem] text-[#DC2626] mt-1">{error}</p>}
    </div>
  );
}
