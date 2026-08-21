/* Contrato con el backend para usuarios (/users). El listado ya llega acotado
   a la organizacion de quien consulta, de modo que el frontend no filtra nada
   por su cuenta. */

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLOCKED';

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  organizationId: string | null;
  roles: string[];
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
