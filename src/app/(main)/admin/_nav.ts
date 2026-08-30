import type { AreaNavItem } from '../_shell/AreaHeader';

/* Menu del personal interno de Suminia. No tiene tienda ni carrito: su trabajo
   es aprobar y vigilar las empresas de los dos lados del marketplace. */
export const ADMIN_NAV: AreaNavItem[] = [
  { label: 'PROVEEDORES', href: '/admin/proveedores' },
];

export const ADMIN_ACCOUNT_LINKS: AreaNavItem[] = [
  { label: 'Mi perfil', href: '/admin/perfil' },
  { label: 'Seguridad', href: '/admin/seguridad' },
];
