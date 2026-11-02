import {
  Briefcase,
  Clipboard,
  DollarSign,
  FileText,
  Home,
  Package,
  Shield,
  User,
  Users,
} from 'react-feather';

import type { SidebarGroup } from '../_shell/sidebar.types';

/* Navegacion del proveedor, agrupada por lo que es cada cosa: su catalogo es el
   trabajo diario, su cuenta son los ajustes. Con las ocho entradas en una sola
   lista no se distingue lo uno de lo otro.

   Nada de la tienda B2C —categorias, buscador, carrito— porque un proveedor
   vende, no compra. */
export const SUPPLIER_SIDEBAR: SidebarGroup[] = [
  /* Los pedidos primero: es lo que el proveedor abre cada dia, y el catalogo
     se toca cuando cambia algo. */
  {
    label: 'Ventas',
    /* Las liquidaciones junto a los pedidos: son lo que el proveedor cobra
       por lo que vendio. */
    items: [
      { label: 'Pedidos', href: '/supplier/orders', icon: Clipboard },
      { label: 'Liquidaciones', href: '/supplier/payouts', icon: DollarSign },
    ],
  },
  {
    label: 'Catálogo',
    items: [{ label: 'Mis productos', href: '/supplier/products', icon: Package }],
  },
  {
    label: 'Mi cuenta',
    items: [
      { label: 'Resumen', href: '/supplier/account', icon: Home },
      {
        label: 'Mi empresa',
        href: '/supplier/account/company',
        icon: Briefcase,
        /* Las mismas de COMPANY_SECTIONS en el modulo organizations. Quien
           solo lee no tiene contactos que ver. */
        children: [
          { label: 'Datos generales', href: '/supplier/account/company' },
          { label: 'Documentos', href: '/supplier/account/company/documents' },
          {
            label: 'Contactos',
            href: '/supplier/account/company/contacts',
            permission: 'organization:update',
          },
          { label: 'Condiciones y pagos', href: '/supplier/account/company/terms' },
        ],
      },
      /* Lo que firma para que lo aprueben. Se queda despues, en solo lectura,
         para que pueda consultar lo que declaro. */
      { label: 'Declaración', href: '/supplier/account/declaration', icon: FileText },
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
