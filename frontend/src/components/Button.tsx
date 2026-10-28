// frontend/src/components/Button.tsx
// Base button of the app, in three variants: "primary" for the main action of a screen
// (filled, uses the palette's light green), "outline" for secondary actions on light
// backgrounds, and "outline-light" for secondary actions on dark backgrounds such as the
// admin header. It is a plain <button>, so it takes the usual attributes (type, disabled,
// onClick).

import type { ComponentProps } from 'react';

type ButtonProps = Omit<ComponentProps<'button'>, 'className'> & {
  variant?: 'primary' | 'outline' | 'outline-light';
};

const VARIANT_CLASSES = {
  primary: 'bg-secondary text-primary hover:bg-secondary/80',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-bg-main',
  'outline-light': 'border border-bg-main text-bg-main hover:bg-bg-main hover:text-primary',
};

export function Button({ variant = 'primary', type = 'button', ...buttonProps }: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg px-5 py-2 font-heading font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]}`}
      {...buttonProps}
    />
  );
}
