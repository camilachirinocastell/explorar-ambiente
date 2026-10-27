// frontend/src/components/form/FieldWrapper.tsx
// Label, control and error message of one form field. The text, select and textarea
// components use it, so every field looks and behaves the same way.

import type { ReactNode } from 'react';
import { FieldError } from './FieldError';

interface FieldWrapperProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}

export function FieldWrapper({ id, label, optional, error, children }: FieldWrapperProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-text-main/70"> (opcional)</span>}
      </label>
      {children}
      <FieldError id={id} error={error} />
    </div>
  );
}
