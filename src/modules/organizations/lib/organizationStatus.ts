import type { OrganizationStatus } from '../model/organization.types';

/* Etiqueta y color de cada estado. PENDING es el estado inicial tras el
   registro: la organizacion existe pero no puede operar hasta que Suminia la
   verifica, y por eso se destaca en la tabla. */
const STATUS_META: Record<OrganizationStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pendiente', className: 'bg-warning' },
  ACTIVE: { label: 'Activo', className: 'bg-success' },
  SUSPENDED: { label: 'Suspendido', className: 'bg-secondary' },
  REJECTED: { label: 'Rechazado', className: 'bg-danger' },
};

export const getStatusLabel = (status: OrganizationStatus): string =>
  STATUS_META[status]?.label ?? status;

export const getStatusClassName = (status: OrganizationStatus): string =>
  STATUS_META[status]?.className ?? 'bg-secondary';

/** Solo una organización pendiente se puede aprobar. */
export const canApprove = (status: OrganizationStatus): boolean => status === 'PENDING';
