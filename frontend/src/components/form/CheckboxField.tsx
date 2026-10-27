// frontend/src/components/form/CheckboxField.tsx
// Checkbox with its label and error message. The label is a ReactNode so it can hold
// a link, for example to the privacy policy.

import type { ComponentProps, ReactNode } from 'react';
import { getErrorAria } from './field-utils';
import { FieldError } from './FieldError';

type CheckboxFieldProps = Omit<ComponentProps<'input'>, 'className' | 'type' | 'children'> & {
  id: string;
  label: ReactNode;
  error?: string;
};

export function CheckboxField({ id, label, error, ...inputProps }: CheckboxFieldProps) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-1 size-4 shrink-0 accent-primary"
          {...getErrorAria(id, error)}
          {...inputProps}
        />
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
      </div>
      <FieldError id={id} error={error} />
    </div>
  );
}
