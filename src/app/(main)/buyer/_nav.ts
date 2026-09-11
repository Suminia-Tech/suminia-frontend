import type { AreaNavItem } from '../_shell/AreaHeader';
import type { PanelSection } from '../_shell/PanelNav';

/* Menu de la cuenta del comprador. El catalogo no esta aqui: el comprador
   compra en la tienda publica, que es la misma que ve un visitante y la que
   lleva el buscador, las categorias y el carrito. Este chasis es solo para las
   pantallas de cuenta, y "TIENDA" devuelve a ella. */
export const BUYER_NAV: AreaNavItem[] = [
  { label: 'TIENDA', href: '/' },
  { label: 'MI CUENTA', href: '/buyer/account' },
  { label: 'BLOG', href: '/blog/blog_details?id=0' },
];

/* Falta "Mi empresa": el backend ya expone /buyers, pero las pantallas de
   empresa que existen consultan /suppliers. Se agrega al apuntarlas al modulo
   que corresponda segun el area. */
export const BUYER_ACCOUNT_SECTIONS: PanelSection[] = [
  { label: 'Mi equipo', href: '/buyer/account/team', permission: 'user:list' },
  { label: 'Mi perfil', href: '/buyer/account/profile' },
  { label: 'Seguridad', href: '/buyer/account/security' },
];
