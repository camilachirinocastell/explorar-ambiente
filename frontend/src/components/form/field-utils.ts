// frontend/src/components/form/field-utils.ts
// Pieces shared by the form field components: the look of the controls and the ARIA
// attributes that connect a control with its error message.

export const controlClassName =
  'block w-full rounded-lg border border-primary-light/40 bg-bg-card px-3 py-2 text-text-main placeholder:text-text-main/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-secondary aria-[invalid=true]:border-error disabled:opacity-60';

// Marks the control as invalid and links it to the message rendered by FieldError
export function getErrorAria(id: string, error?: string) {
  return {
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
  };
}
