import type { UserStatus } from '../model/user.types';

/* Etiquetas de rol dentro de una empresa. El nombre completo del rol incluye
   el lado del marketplace (supplier_/buyer_), pero dentro de "Mi equipo" ese
   prefijo sobra: todos los miembros son de la misma empresa. */
const ROLE_LABELS: Record<string, string> = {
  supplier_admin: 'Administrador',
  supplier_operator: 'Operador',
  buyer_admin: 'Administrador',
  buyer_operator: 'Operador',
  admin: 'Administrador de Suminia',
  superuser: 'Superusuario',
};

export const getTeamRoleLabel = (roles: string[]): string => {
  const [role] = roles;
  return role ? (ROLE_LABELS[role] ?? role) : 'Sin rol';
};

const STATUS_LABELS: Record<UserStatus, { label: string; className: string }> = {
  ACTIVE: { label: 'Activo', className: 'bg-success' },
  INACTIVE: { label: 'Inactivo', className: 'bg-secondary' },
  SUSPENDED: { label: 'Suspendido', className: 'bg-warning' },
  BLOCKED: { label: 'Bloqueado', className: 'bg-danger' },
};

export const getUserStatusLabel = (status: UserStatus): string =>
  STATUS_LABELS[status]?.label ?? status;

export const getUserStatusClassName = (status: UserStatus): string =>
  STATUS_LABELS[status]?.className ?? 'bg-secondary';
