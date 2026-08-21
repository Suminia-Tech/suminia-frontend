/* Pestanas del panel de cuenta.

   Las siete de la demo de Voxo (Dashboard, Orders, Wishlist, Saved Address,
   Payment, Profile, Security) quedan ocultas: son de una tienda B2C y no
   aplican a un proveedor, que vende en lugar de comprar. Sus componentes
   siguen en _template hasta que se decida si alguna vuelve como pantalla real.

   Vive aparte porque UserNav pinta el menu y AllTabContain el contenido, de
   modo que importarla de cualquiera de los dos crearia un ciclo. */

export const ACCOUNT_TABS = {
  SUMMARY: 1,
  COMPANY: 2,
  TEAM: 3,
};

export const ACCOUNT_TAB_ITEMS = [
  { id: ACCOUNT_TABS.SUMMARY, label: "Resumen" },
  { id: ACCOUNT_TABS.COMPANY, label: "Mi empresa" },
  { id: ACCOUNT_TABS.TEAM, label: "Mi equipo" },
];
