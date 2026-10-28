// Zod schema for the admin login form. It only checks that both fields are filled in
// and the email looks like an email; the password rules belong to the backend, which
// answers with the same generic error whether the email or the password is wrong.

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Ingresá un email válido.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
