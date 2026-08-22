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
  PROFILE: 4,
  SECURITY: 5,
};

/* `permission` oculta la entrada a quien no la tiene: un operador no puede
   listar el equipo, de modo que ofrecerle la pestana solo le daria un 403.
   `requiresOrganization` deja fuera al personal interno de Suminia, que no
   pertenece a ninguna empresa. */
export const ACCOUNT_TAB_ITEMS = [
  {
    id: ACCOUNT_TABS.SUMMARY,
    label: "Resumen",
    requiresOrganization: true,
  },
  {
    id: ACCOUNT_TABS.COMPANY,
    label: "Mi empresa",
    requiresOrganization: true,
  },
  {
    id: ACCOUNT_TABS.TEAM,
    label: "Mi equipo",
    requiresOrganization: true,
    permission: "user:list",
  },
  { id: ACCOUNT_TABS.PROFILE, label: "Mi perfil" },
  { id: ACCOUNT_TABS.SECURITY, label: "Seguridad" },
];
