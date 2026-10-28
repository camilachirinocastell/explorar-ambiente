// Card with one inquiry of the admin panel: who wrote, what they asked for, the message
// and a selector to change its status. It only shows data and reports the new status
// to its parent, which talks to the API.

import type { Inquiry } from '../../api/inquiries';
import {
  CLIENT_TYPE_LABELS,
  INQUIRY_STATUSES,
  INQUIRY_STATUS_LABELS,
  SERVICE_LABELS,
} from '../../constants/inquiry-options';
import type { InquiryStatus } from '../../constants/inquiry-options';
import { controlClassName } from '../form/field-utils';

// The text of the badge always says the status, so color is never the only signal
const STATUS_BADGE_CLASSES: Record<InquiryStatus, string> = {
  pending: 'bg-accent/40 text-text-main',
  reviewed: 'bg-secondary/50 text-text-main',
  contacted: 'bg-primary text-bg-main',
};

interface InquiryCardProps {
  inquiry: Inquiry;
  isUpdating: boolean;
  onStatusChange: (id: string, status: InquiryStatus) => void;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
}

export function InquiryCard({ inquiry, isUpdating, onStatusChange }: InquiryCardProps) {
  const selectId = `status-${inquiry.id}`;

  const handleChange = (value: string) => {
    const nextStatus = INQUIRY_STATUSES.find((status) => status === value);
    if (nextStatus && nextStatus !== inquiry.status) {
      onStatusChange(inquiry.id, nextStatus);
    }
  };

  return (
    <article className="rounded-lg bg-bg-card p-5 shadow">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-heading text-lg font-bold text-primary">{inquiry.clientName}</h2>
          <p className="text-sm text-text-main">
            {CLIENT_TYPE_LABELS[inquiry.clientType]}
            {inquiry.companyOrLocation ? ` · ${inquiry.companyOrLocation}` : ''}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASSES[inquiry.status]}`}
        >
          {INQUIRY_STATUS_LABELS[inquiry.status]}
        </span>
      </header>

      <p className="mt-3 text-sm font-semibold text-text-main">
        {SERVICE_LABELS[inquiry.requestedService]}
      </p>
      <p className="mt-2 break-words whitespace-pre-wrap text-text-main">{inquiry.message}</p>

      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-main">
        <a href={`mailto:${inquiry.email}`} className="underline">
          {inquiry.email}
        </a>
        {inquiry.phone && (
          <a href={`tel:${inquiry.phone}`} className="underline">
            {inquiry.phone}
          </a>
        )}
      </p>

      <footer className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-primary/10 pt-4">
        <time dateTime={inquiry.createdAt} className="text-sm text-text-main">
          {formatDate(inquiry.createdAt)}
        </time>
        <div className="flex items-center gap-2">
          <label htmlFor={selectId} className="text-sm font-semibold text-text-main">
            Estado
          </label>
          <select
            id={selectId}
            className={controlClassName}
            value={inquiry.status}
            disabled={isUpdating}
            onChange={(event) => handleChange(event.target.value)}
          >
            {INQUIRY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {INQUIRY_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </footer>
    </article>
  );
}
