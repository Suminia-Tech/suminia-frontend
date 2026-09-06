import { Briefcase, Home, Package, Shield, User, Users } from 'react-feather';

import type { SidebarGroup } from '../_shell/sidebar.types';

/* Navegacion del proveedor, agrupada por lo que es cada cosa: su catalogo es el
   trabajo diario, su cuenta son los ajustes. Con las ocho entradas en una sola
   lista no se distingue lo uno de lo otro.

   Nada de la tienda B2C —categorias, buscador, carrito— porque un proveedor
   vende, no compra. */
export const SUPPLIER_SIDEBAR: SidebarGroup[] = [
  {
    label: 'Catálogo',
    items: [{ label: 'Mis productos', href: '/supplier/products', icon: Package }],
  },
  {
    label: 'Mi cuenta',
    items: [
      { label: 'Resumen', href: '/supplier/account', icon: Home },
      { label: 'Mi empresa', href: '/supplier/account/company', icon: Briefcase },
      {
        label: 'Mi equipo',
        href: '/supplier/account/team',
        icon: Users,
        permission: 'user:list',
      },
      { label: 'Mi perfil', href: '/supplier/account/profile', icon: User },
      { label: 'Seguridad', href: '/supplier/account/security', icon: Shield },
    ],
  },
];
