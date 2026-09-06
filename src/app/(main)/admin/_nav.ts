import type { AreaNavItem } from '../_shell/AreaHeader';
import type { PanelSection } from '../_shell/PanelNav';

/* Menu del personal interno de Suminia. No tiene tienda ni carrito: su trabajo
   es aprobar y vigilar las empresas de los dos lados del marketplace. */
export const ADMIN_NAV: AreaNavItem[] = [
  { label: 'MI CUENTA', href: '/admin/account' },
  { label: 'PROVEEDORES', href: '/admin/supplieres' },
];

/* Sin "Mi empresa" ni "Mi equipo": el personal interno no pertenece a ninguna
   organizacion, de modo que esas secciones no tienen a que referirse. */
export const ADMIN_ACCOUNT_SECTIONS: PanelSection[] = [
  { label: 'Mi perfil', href: '/admin/account/profile' },
  { label: 'Seguridad', href: '/admin/account/security' },
];
