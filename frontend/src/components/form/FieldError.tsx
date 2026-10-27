// frontend/src/components/form/FieldError.tsx
// Error message shown under a form field. It is announced to screen readers when it
// appears and its id is the one the control points to with aria-describedby.

interface FieldErrorProps {
  id: string;
  error?: string;
}

export function FieldError({ id, error }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-error">
      {error}
    </p>
  );
}
