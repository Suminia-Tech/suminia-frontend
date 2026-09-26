import {
  Clipboard,
  Home,
  Shield,
  ShoppingBag,
  Tag,
  Truck,
  User,
} from 'react-feather';

import type { SidebarGroup } from '../_shell/sidebar.types';

/* Navegacion del personal interno de Suminia.

   Pasa a panel lateral, el mismo chasis del proveedor. Estaba en barra
   superior, y con ella cada pantalla repetia su nombre tres veces —en el menu,
   en la franja de migas del tema y en su propio titulo— sin que el conjunto
   dijera nunca que mas hay en el area.

   Agrupada por lo que es cada cosa, no por lo que toca. "Operacion" es lo que
   se mira todos los dias; "Empresas" es el trabajo que le da sentido al area
   —aprobar a quien entra—; el catalogo es el vocabulario del marketplace.

   Sin "Mi empresa" ni "Mi equipo": el personal interno no pertenece a ninguna
   organizacion, de modo que esas secciones no tienen a que referirse. */
export const ADMIN_SIDEBAR: SidebarGroup[] = [
  {
    label: 'Operación',
    items: [
      { label: 'Resumen', href: '/admin', icon: Home },
      { label: 'Pedidos', href: '/admin/orders', icon: Clipboard },
    ],
  },
  {
    /* Primero proveedores: son los que traen el catalogo, y sin catalogo el
       comprador aprobado no tiene que comprar. */
    label: 'Empresas',
    items: [
      { label: 'Proveedores', href: '/admin/suppliers', icon: Truck },
      { label: 'Compradores', href: '/admin/buyers', icon: ShoppingBag },
    ],
  },
  {
    label: 'Catálogo',
    items: [{ label: 'Categorías', href: '/admin/categories', icon: Tag }],
  },
  {
    label: 'Mi cuenta',
    items: [
      { label: 'Mi perfil', href: '/admin/account/profile', icon: User },
      { label: 'Seguridad', href: '/admin/account/security', icon: Shield },
    ],
  },
];
