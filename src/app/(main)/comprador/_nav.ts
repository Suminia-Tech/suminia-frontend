import type { AreaNavItem } from '../_shell/AreaHeader';

/* Menu del comprador. Este si es el lado de compra del marketplace, de modo que
   aqui el catalogo y —cuando exista— el carrito tienen sentido. */
export const BUYER_NAV: AreaNavItem[] = [
  { label: 'CATÁLOGO', href: '/comprador/catalogo' },
  { label: 'BLOG', href: '/blog/blog_details?id=0' },
];

/* Falta "Mi empresa": el backend todavia no expone /buyers, y las pantallas de
   empresa que existen consultan /suppliers. Se agrega cuando ese modulo exista
   en el backend. */
export const BUYER_ACCOUNT_LINKS: AreaNavItem[] = [
  { label: 'Mi equipo', href: '/comprador/equipo' },
  { label: 'Mi perfil', href: '/comprador/perfil' },
  { label: 'Seguridad', href: '/comprador/seguridad' },
];
