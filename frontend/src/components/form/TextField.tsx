// frontend/src/components/form/TextField.tsx
// Single-line input with its label and error message. It takes the usual <input>
// attributes, so React Hook Form's register() can be spread on it.

import type { ComponentProps } from 'react';
import { controlClassName, getErrorAria } from './field-utils';
import { FieldWrapper } from './FieldWrapper';

type TextFieldProps = Omit<ComponentProps<'input'>, 'className'> & {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
};

export function TextField({ id, label, optional, error, ...inputProps }: TextFieldProps) {
  return (
    <FieldWrapper id={id} label={label} optional={optional} error={error}>
      <input id={id} className={controlClassName} {...getErrorAria(id, error)} {...inputProps} />
    </FieldWrapper>
  );
}
