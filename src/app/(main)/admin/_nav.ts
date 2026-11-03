import {
  CheckSquare,
  Clipboard,
  CreditCard,
  DollarSign,
  BarChart2,
  Home,
  PieChart,
  Settings,
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
      /* Para el area comercial: como va el negocio. */
      {
        label: 'Indicadores',
        href: '/admin/insights',
        icon: BarChart2,
        permission: 'organization:list',
      },
    ],
  },
  {
    /* El dinero: lo maneja finanzas. Primero lo que espera a alguien —el
       tablero y los pagos por verificar—, despues lo que se le paga a los
       proveedores y lo que se le fia a los compradores, y al final las
       reglas. Configuracion y liquidaciones piden finance:manage; quien solo
       verifica pagos ve lo suyo. */
    label: 'Finanzas',
    items: [
      {
        label: 'Resumen financiero',
        href: '/admin/finance',
        icon: PieChart,
        permission: 'payment:verify',
      },
      {
        label: 'Pagos',
        href: '/admin/finance/payments',
        icon: CreditCard,
        permission: 'payment:verify',
        children: [
          { label: 'Por verificar', href: '/admin/finance/payments' },
          { label: 'Por facturar', href: '/admin/finance/to-invoice' },
          { label: 'Reclamos', href: '/admin/finance/claims' },
          { label: 'Devoluciones', href: '/admin/finance/refunds' },
          { label: 'Facturas de proveedores', href: '/admin/finance/invoices' },
          { label: 'Vencidos', href: '/admin/finance/overdue' },
        ],
      },
      {
        label: 'Liquidaciones',
        href: '/admin/finance/payouts',
        icon: DollarSign,
        permission: 'finance:manage',
      },
      {
        label: 'Crédito',
        href: '/admin/finance/credit',
        icon: ShoppingBag,
        permission: 'payment:verify',
      },
      {
        label: 'Configuración',
        href: '/admin/finance/settings',
        icon: Settings,
        permission: 'finance:manage',
      },
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
    /* La revision primero: es trabajo que espera, las categorias son
       mantenimiento. */
    items: [
      { label: 'Productos', href: '/admin/products', icon: CheckSquare },
      { label: 'Categorías', href: '/admin/categories', icon: Tag },
    ],
  },
  {
    label: 'Mi cuenta',
    items: [
      { label: 'Mi perfil', href: '/admin/account/profile', icon: User },
      { label: 'Seguridad', href: '/admin/account/security', icon: Shield },
    ],
  },
];
