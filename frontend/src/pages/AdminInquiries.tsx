// Main screen of the admin panel: the inquiries received from the contact form, newest
// first, with a filter by status, pagination and a status change on every card.
// If the backend answers 401 (the session expired while the panel was open), the
// session is cleared and ProtectedRoute sends the user back to /login.

import { useEffect, useState } from 'react';

import { ApiError } from '../api/client';
import { listInquiries, updateInquiryStatus } from '../api/inquiries';
import type { InquiryPage } from '../api/inquiries';
import { InquiryCard } from '../components/admin/InquiryCard';
import { Button } from '../components/Button';
import { controlClassName } from '../components/form/field-utils';
import { INQUIRY_STATUSES, INQUIRY_STATUS_LABELS } from '../constants/inquiry-options';
import type { InquiryStatus } from '../constants/inquiry-options';
import { useAuthStore } from '../store/authStore';

const PAGE_SIZE = 10;

type StatusFilter = InquiryStatus | 'all';

// A result belongs to the request that produced it (its key), so "loading" is simply
// "the stored result is not for the current request"
interface LoadResult {
  key: string;
  page?: InquiryPage;
  error?: string;
}

function isSessionExpired(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.code === 'NETWORK_ERROR') {
    return 'No se pudo conectar con el servidor. Revisá tu conexión.';
  }
  return fallback;
}

export function AdminInquiries() {
  const logout = useAuthStore((state) => state.logout);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<LoadResult | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const requestKey = `${statusFilter}|${pageNumber}|${reloadCount}`;
  const current = result?.key === requestKey ? result : null;

  useEffect(() => {
    let ignore = false;

    listInquiries({
      status: statusFilter === 'all' ? undefined : statusFilter,
      page: pageNumber,
      limit: PAGE_SIZE,
    })
      .then((page) => {
        if (!ignore) setResult({ key: requestKey, page });
      })
      .catch((error: unknown) => {
        if (ignore) return;
        if (isSessionExpired(error)) {
          void logout().catch(() => undefined);
          return;
        }
        setResult({
          key: requestKey,
          error: getErrorMessage(error, 'No se pudieron cargar las consultas.'),
        });
      });

    // A newer request (another filter or page) makes this answer irrelevant
    return () => {
      ignore = true;
    };
  }, [requestKey, statusFilter, pageNumber, logout]);

  const handleFilterChange = (value: string) => {
    setStatusFilter(INQUIRY_STATUSES.find((status) => status === value) ?? 'all');
    setPageNumber(1);
  };

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    setUpdatingId(id);
    setUpdateError(null);
    try {
      const updated = await updateInquiryStatus(id, status);
      // The card stays where it is, even if it no longer matches the filter, until the list is reloaded
      setResult((previous) =>
        previous?.page
          ? {
              ...previous,
              page: {
                ...previous.page,
                items: previous.page.items.map((item) => (item.id === updated.id ? updated : item)),
              },
            }
          : previous,
      );
    } catch (error) {
      if (isSessionExpired(error)) {
        void logout().catch(() => undefined);
        return;
      }
      setUpdateError(getErrorMessage(error, 'No se pudo cambiar el estado. Probá de nuevo.'));
    } finally {
      setUpdatingId(null);
    }
  };

  const page = current?.page;

  return (
    <section>
      <h1 className="font-heading text-3xl font-bold text-primary">Consultas recibidas</h1>

      <div className="mt-6 flex items-center gap-2">
        <label htmlFor="status-filter" className="text-sm font-semibold text-text-main">
          Filtrar por estado
        </label>
        <select
          id="status-filter"
          className={controlClassName}
          value={statusFilter}
          onChange={(event) => handleFilterChange(event.target.value)}
        >
          <option value="all">Todas</option>
          {INQUIRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {INQUIRY_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {updateError && (
        <p role="alert" className="mt-4 text-sm text-error">
          {updateError}
        </p>
      )}

      {current === null && (
        <p role="status" className="mt-8 text-text-main">
          Cargando consultas…
        </p>
      )}

      {current?.error && (
        <div className="mt-8">
          <p role="alert" className="text-error">
            {current.error}
          </p>
          <div className="mt-3">
            <Button variant="outline" onClick={() => setReloadCount((count) => count + 1)}>
              Reintentar
            </Button>
          </div>
        </div>
      )}

      {page && page.items.length === 0 && (
        <p className="mt-8 text-text-main">
          {statusFilter === 'all'
            ? 'Todavía no llegó ninguna consulta.'
            : 'No hay consultas con ese estado.'}
        </p>
      )}

      {page && page.items.length > 0 && (
        <>
          <ul className="mt-6 space-y-4">
            {page.items.map((inquiry) => (
              <li key={inquiry.id}>
                <InquiryCard
                  inquiry={inquiry}
                  isUpdating={updatingId === inquiry.id}
                  onStatusChange={handleStatusChange}
                />
              </li>
            ))}
          </ul>

          <nav
            aria-label="Paginación"
            className="mt-8 flex flex-wrap items-center justify-between gap-3"
          >
            <p className="text-sm text-text-main">
              Página {page.page} de {page.totalPages} · {page.total}{' '}
              {page.total === 1 ? 'consulta' : 'consultas'}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page.page <= 1}
                onClick={() => setPageNumber((number) => number - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={page.page >= page.totalPages}
                onClick={() => setPageNumber((number) => number + 1)}
              >
                Siguiente
              </Button>
            </div>
          </nav>
        </>
      )}
    </section>
  );
}
