// Login page of the admin panel. A visitor who already has a session is sent straight
// to /admin; after a successful login the store flips to "authenticated" and the same
// redirect takes over, so this page never navigates by hand.

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { ApiError } from '../api/client';
import { Button } from '../components/Button';
import { TextField } from '../components/form/TextField';
import { loginSchema } from '../schemas/login.schema';
import type { LoginFormValues } from '../schemas/login.schema';
import { useAuthStore } from '../store/authStore';

// Maps a failed login to a message for the person; the backend codes come from its error middleware
function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'INVALID_CREDENTIALS') return 'El email o la contraseña no son correctos.';
    if (error.code === 'TOO_MANY_LOGIN_ATTEMPTS') {
      return 'Demasiados intentos fallidos. Esperá unos minutos y volvé a probar.';
    }
    if (error.code === 'NETWORK_ERROR') {
      return 'No se pudo conectar con el servidor. Revisá tu conexión.';
    }
  }
  return 'No se pudo iniciar sesión. Probá de nuevo en un momento.';
}

export function Login() {
  const status = useAuthStore((state) => state.status);
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (status === 'authenticated') {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values);
    } catch (error) {
      setServerError(getLoginErrorMessage(error));
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-primary">Acceso privado</h1>
      <p className="mt-2 text-text-main">Ingresá con tu cuenta para ver las consultas recibidas.</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-5 rounded-lg bg-bg-card p-6 shadow"
      >
        <TextField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          id="login-password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && (
          <p role="alert" className="text-sm text-error">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </form>
    </section>
  );
}
