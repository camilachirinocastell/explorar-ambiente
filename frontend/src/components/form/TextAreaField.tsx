// frontend/src/components/form/TextAreaField.tsx
// Multi-line input with its label and error message, for longer texts such as the
// message of the contact form.

import type { ComponentProps } from 'react';
import { controlClassName, getErrorAria } from './field-utils';
import { FieldWrapper } from './FieldWrapper';

type TextAreaFieldProps = Omit<ComponentProps<'textarea'>, 'className'> & {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
};

export function TextAreaField({
  id,
  label,
  optional,
  error,
  rows = 5,
  ...textAreaProps
}: TextAreaFieldProps) {
  return (
    <FieldWrapper id={id} label={label} optional={optional} error={error}>
      <textarea
        id={id}
        rows={rows}
        className={controlClassName}
        {...getErrorAria(id, error)}
        {...textAreaProps}
      />
    </FieldWrapper>
  );
}
