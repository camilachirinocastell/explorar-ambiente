// frontend/src/components/form/SelectField.tsx
// Dropdown with its label and error message. The first option is a placeholder with an
// empty value, so a form that starts unselected fails validation until a real option
// is picked.

import type { ComponentProps } from 'react';
import { controlClassName, getErrorAria } from './field-utils';
import { FieldWrapper } from './FieldWrapper';

type SelectFieldProps = Omit<ComponentProps<'select'>, 'className' | 'children'> & {
  id: string;
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  optional?: boolean;
  error?: string;
};

export function SelectField({
  id,
  label,
  placeholder,
  options,
  optional,
  error,
  ...selectProps
}: SelectFieldProps) {
  return (
    <FieldWrapper id={id} label={label} optional={optional} error={error}>
      <select id={id} className={controlClassName} {...getErrorAria(id, error)} {...selectProps}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
