// frontend/src/components/ContactForm.tsx
// Contact form of the landing page. It validates with the Zod schema (through React
// Hook Form), sends the inquiry to the backend and shows the result: a confirmation,
// or an error message that depends on what failed. It includes the hidden honeypot
// field (D43) that bots fill in and people never see.

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiError } from '../api/client';
import { sendInquiry } from '../api/inquiries';
import {
  CLIENT_TYPE_LABELS,
  CLIENT_TYPES,
  SERVICE_LABELS,
  SERVICE_TYPES,
} from '../constants/inquiry-options';
import { inquirySchema, type InquiryFormValues } from '../schemas/inquiry.schema';
import { Button } from './Button';
import { CheckboxField } from './form/CheckboxField';
import { SelectField } from './form/SelectField';
import { TextAreaField } from './form/TextAreaField';
import { TextField } from './form/TextField';

const CLIENT_TYPE_OPTIONS = CLIENT_TYPES.map((value) => ({
  value,
  label: CLIENT_TYPE_LABELS[value],
}));

const SERVICE_OPTIONS = SERVICE_TYPES.map((value) => ({
  value,
  label: SERVICE_LABELS[value],
}));

// The message depends on what failed: connection, rate limit, rejected data or anything else
function getSubmitErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'NETWORK_ERROR') {
      return 'No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.';
    }
    if (error.status === 429) {
      return 'Enviaste varias consultas seguidas. Probá de nuevo dentro de un rato.';
    }
    if (error.code === 'VALIDATION_ERROR') {
      return 'Revisá los datos ingresados e intentá de nuevo.';
    }
  }
  return 'No pudimos enviar tu consulta. Intentá de nuevo más tarde.';
}

export function ContactForm() {
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    // The two dropdowns have no default: they start on their placeholder option
    defaultValues: {
      clientName: '',
      companyOrLocation: '',
      email: '',
      phone: '',
      message: '',
      privacyAccepted: false,
      website: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await sendInquiry(values);
      reset();
      setIsSent(true);
    } catch (error) {
      setSubmitError(getSubmitErrorMessage(error));
    }
  });

  if (isSent) {
    return (
      <div role="status" className="text-center">
        <h3 className="text-xl font-bold">¡Gracias por tu consulta!</h3>
        <p className="mt-2">La recibimos y te vamos a responder a la brevedad.</p>
        <div className="mt-6">
          <Button variant="outline" onClick={() => setIsSent(false)}>
            Enviar otra consulta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 md:grid-cols-2">
      <SelectField
        id="clientType"
        label="¿Quién consulta?"
        placeholder="Elegí una opción"
        options={CLIENT_TYPE_OPTIONS}
        error={errors.clientType?.message}
        {...register('clientType')}
      />
      <TextField
        id="clientName"
        label="Nombre y apellido"
        autoComplete="name"
        error={errors.clientName?.message}
        {...register('clientName')}
      />
      <TextField
        id="companyOrLocation"
        label="Empresa, municipio o localidad"
        optional
        error={errors.companyOrLocation?.message}
        {...register('companyOrLocation')}
      />
      <TextField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        id="phone"
        label="Teléfono"
        type="tel"
        autoComplete="tel"
        optional
        error={errors.phone?.message}
        {...register('phone')}
      />
      <SelectField
        id="requestedService"
        label="Servicio que te interesa"
        placeholder="Elegí un servicio"
        options={SERVICE_OPTIONS}
        error={errors.requestedService?.message}
        {...register('requestedService')}
      />
      <div className="md:col-span-2">
        <TextAreaField
          id="message"
          label="Mensaje"
          error={errors.message?.message}
          {...register('message')}
        />
      </div>
      <div className="md:col-span-2">
        <CheckboxField
          id="privacyAccepted"
          label={
            <>
              Acepto la{' '}
              <a
                href="/privacidad"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline"
              >
                política de privacidad
              </a>{' '}
              y el tratamiento de mis datos para responder esta consulta.
            </>
          }
          error={errors.privacyAccepted?.message}
          {...register('privacyAccepted')}
        />
      </div>

      {/* Honeypot: off-screen and hidden from assistive technology, so only bots fill it */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Sitio web
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      {submitError && (
        <p role="alert" className="text-error md:col-span-2">
          {submitError}
        </p>
      )}

      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando…' : 'Enviar consulta'}
        </Button>
      </div>
    </form>
  );
}
