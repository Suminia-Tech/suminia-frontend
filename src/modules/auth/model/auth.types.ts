/* Contrato con el backend de Suminia (/auth/*). Es la frontera donde de verdad
   se rompen las cosas, asi que se tipa explicitamente en vez de dejar `any`. */

export type RoleName =
  | 'superuser'
  | 'admin'
  | 'supplier_admin'
  | 'supplier_operator'
  | 'buyer_admin'
  | 'buyer_operator';

/* El backend devuelve los roles como objetos o como cadenas segun el endpoint,
   de modo que ambas formas se contemplan al leerlos. */
export type Role = RoleName | { name: RoleName };

export type OrganizationType = 'BUYER' | 'SUPPLIER';

export interface User {
  id: string;
  name: string;
  email: string;
  roles?: Role[];
  organizationId?: string;
  emailVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /* Indica que ya se leyo localStorage en el cliente. El estado arranca vacio
     para que el HTML del servidor y el del cliente coincidan, asi que sin esta
     bandera las pantallas privadas parpadean como "no autenticado". */
  hydrated: boolean;
}

/* --- Peticiones --- */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  organizationType: OrganizationType;
  taxId: string;
  legalName: string;
  organizationName: string;
  organizationEmail: string;
  organizationPhone?: string;
  city?: string;
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  /* El DTO del backend espera "password", no "newPassword": el pipe corre con
     forbidNonWhitelisted, de modo que el nombre antiguo daba 422. */
  password: string;
}

/* --- Respuestas --- */

/** El backend envuelve todo en { data, message }. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type LoginResponse = ApiResponse<Session>;
export type ProfileResponse = ApiResponse<{ user: User }>;
