import type { PanelSection } from '../_shell/PanelNav';

/* Secciones de la cuenta del comprador. No hay mas menu que este: el resto de
   su navegacion es la de la tienda, la misma que ve cualquiera. */
export const BUYER_ACCOUNT_SECTIONS: PanelSection[] = [
  { label: 'Mi empresa', href: '/buyer/account/company' },
  { label: 'Sedes de entrega', href: '/buyer/account/locations' },
  {
    /* Un operador no puede listar el equipo: ofrecerselo solo le daria un 403. */
    label: 'Mi equipo',
    href: '/buyer/account/team',
    permission: 'user:list',
  },
  { label: 'Mi perfil', href: '/buyer/account/profile' },
  { label: 'Seguridad', href: '/buyer/account/security' },
];
