import type { AreaNavItem } from '../_shell/AreaHeader';
import type { PanelSection } from '../_shell/PanelNav';

/* Menu superior del proveedor. Su cuenta y su catalogo son dos trabajos
   distintos y por eso son dos entradas, no una con pestanas dentro. El blog es
   contenido publico de Suminia.

   Nada de la tienda B2C —categorias, buscador, carrito— porque un proveedor
   vende, no compra. */
export const SUPPLIER_NAV: AreaNavItem[] = [
  { label: 'MI CUENTA', href: '/supplier/account' },
  { label: 'MIS PRODUCTOS', href: '/supplier/products' },
  { label: 'BLOG', href: '/blog/blog_details?id=0' },
];

/* Secciones de la cuenta, en su barra lateral. El catalogo no esta aqui: vive
   en su propia entrada del menu superior, porque es el trabajo diario del
   proveedor y no un ajuste de su cuenta. */
export const SUPPLIER_ACCOUNT_SECTIONS: PanelSection[] = [
  { label: 'Resumen', href: '/supplier/account' },
  { label: 'Mi empresa', href: '/supplier/account/company' },
  { label: 'Mi equipo', href: '/supplier/account/team', permission: 'user:list' },
  { label: 'Mi perfil', href: '/supplier/account/profile' },
  { label: 'Seguridad', href: '/supplier/account/security' },
];
