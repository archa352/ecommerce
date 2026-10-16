import type { CatalogueStatus } from '@/types/catalogue-admin';

const TONES: Record<string, string> = {
  ACTIVE: 'bg-success-focus text-success-main',
  DRAFT: 'bg-warning-focus text-warning-main',
  ARCHIVED: 'bg-neutral-200 text-neutral-600',
};

/** ARCHIVED is the backend's soft delete, so it reads as muted, not alarming. */
export default function CatalogueStatusBadge({ status }: { status: CatalogueStatus }) {
  return (
    <span
      className={`px-16 py-4 rounded-pill fw-medium text-sm ${TONES[status] ?? 'bg-neutral-200 text-neutral-600'}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
