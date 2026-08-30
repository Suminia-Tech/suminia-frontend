import type { AreaNavItem } from '../_shell/AreaHeader';

/* Menu superior del proveedor. Solo dos entradas: el blog, que es contenido
   publico de Suminia, y su panel. Nada de la tienda B2C —categorias, buscador,
   carrito— porque un proveedor vende, no compra. */
export const SUPPLIER_NAV: AreaNavItem[] = [
  { label: 'MIS PRODUCTOS', href: '/proveedor/productos' },
  { label: 'BLOG', href: '/blog/blog_details?id=0' },
];

/* Secciones del panel. La cuenta no vive aparte: el trabajo (productos) y los
   ajustes (empresa, equipo, perfil) son el mismo sitio, con una sola barra
   lateral, en vez del ir y venir entre /account y /products que habia antes.

   `permission` esconde la entrada a quien no la tiene: un operador no puede
   listar el equipo, de modo que ofrecersela solo le daria un 403. */
export interface PanelSection {
  label: string;
  href: string;
  permission?: string;
}

export const SUPPLIER_PANEL_SECTIONS: PanelSection[] = [
  { label: 'Mis productos', href: '/proveedor/productos' },
  { label: 'Mi empresa', href: '/proveedor/empresa' },
  { label: 'Mi equipo', href: '/proveedor/equipo', permission: 'user:list' },
  { label: 'Mi perfil', href: '/proveedor/perfil' },
  { label: 'Seguridad', href: '/proveedor/seguridad' },
];
