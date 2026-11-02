import { Briefcase, File, FileText, Heart, MapPin, Shield, User, Users } from 'react-feather';

import type { PanelGroup } from '../_shell/PanelNav';

/* La cuenta del comprador, agrupada por de quien es cada cosa, como el panel
   del proveedor. Antes eran seis entradas seguidas, y nada separaba lo que se
   usa al comprar de los ajustes de la empresa o de la propia persona.

   El orden va de lo que mas se usa a lo que menos, y de lo general a lo
   particular: primero lo de comprar, luego la empresa —que es quien compra—
   y al final el usuario, con Seguridad de ultima, como en casi cualquier
   cuenta. Dentro de la empresa, la empresa misma y despues lo que cuelga de
   ella: a donde se le entrega y quienes compran en su nombre.

   Los pedidos no estan aqui: tienen su entrada en la barra de la tienda
   (MIS PEDIDOS), porque es a lo que vuelve el comprador. */
export const BUYER_ACCOUNT_GROUPS: PanelGroup[] = [
  {
    label: 'Compras',
    /* Las cotizaciones antes que los favoritos: son compras en curso, que
       esperan una aprobacion para convertirse en pedido. */
    items: [
      { label: 'Cotizaciones', href: '/buyer/account/quotes', icon: File },
      { label: 'Favoritos', href: '/buyer/account/favorites', icon: Heart },
    ],
  },
  {
    label: 'Organización',
    items: [
      {
        label: 'Mi empresa',
        href: '/buyer/account/company',
        icon: Briefcase,
        /* Las mismas de COMPANY_SECTIONS en el modulo organizations. */
        children: [
          { label: 'Datos generales', href: '/buyer/account/company' },
          { label: 'Documentos', href: '/buyer/account/company/documents' },
          {
            label: 'Contactos',
            href: '/buyer/account/company/contacts',
            permission: 'organization:update',
          },
          {
            label: 'Perfil y medio de pago',
            href: '/buyer/account/company/profile',
            permission: 'organization:update',
          },
        ],
      },
      /* Lo que firma para que lo aprueben, junto a la empresa como en el panel
         del proveedor. Se queda despues, en solo lectura. */
      { label: 'Declaración', href: '/buyer/account/declaration', icon: FileText },
      { label: 'Sedes de entrega', href: '/buyer/account/locations', icon: MapPin },
      {
        /* Un operador no puede listar el equipo: ofrecerselo solo le daria un 403. */
        label: 'Mi equipo',
        href: '/buyer/account/team',
        icon: Users,
        permission: 'user:list',
      },
    ],
  },
  {
    label: 'Mi usuario',
    items: [
      { label: 'Mi perfil', href: '/buyer/account/profile', icon: User },
      { label: 'Seguridad', href: '/buyer/account/security', icon: Shield },
    ],
  },
];
