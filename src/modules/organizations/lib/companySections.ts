import type { OrganizationKind } from '../hooks/useOrganizationAdmin';

/* El id de cada panel de Mi empresa. Los enlaces del Resumen, de la campana y
   de los avisos llevan a /…/account/company/<subseccion>#<id>, y la pantalla
   se desplaza hasta ahi. */
export const SECTION = {
  electronicInvoicing: 'factura-electronica',
  info: 'informacion-empresa',
  warehouses: 'bodegas',
  documents: 'documentos-legales',
  profile: 'perfil-comercial',
  contacts: 'contactos',
  orderEmails: 'correos-ordenes',
  bank: 'cuenta-pagos',
  buyerNature: 'naturaleza',
  buyerPayment: 'medio-de-pago',
} as const;

type SectionId = (typeof SECTION)[keyof typeof SECTION];

/* Las subsecciones de Mi empresa, cada una su pagina y su entrada en el menu
   lateral. Eran once paneles en una sola pantalla, y lo de abajo —documentos,
   cuenta— solo se encontraba bajando hasta el final.

   Se agrupan por lo que se va a hacer: los datos de la empresa, los
   documentos que se suben, las personas a quienes se escribe, y en el
   proveedor las condiciones con que vende y la cuenta donde cobra. Las rutas
   del menu, en el `_nav.ts` de cada area, tienen que coincidir con estas. */
export type CompanySection = 'empresa' | 'documentos' | 'contacto' | 'condiciones' | 'perfil';

export interface CompanySectionMeta {
  id: CompanySection;
  /** El tramo de la URL despues de /company; vacio es la propia /company. */
  segment: string;
  title: string;
  description: string;
}

export const COMPANY_SECTIONS: Record<OrganizationKind, CompanySectionMeta[]> = {
  supplier: [
    {
      id: 'empresa',
      segment: '',
      title: 'Mi empresa',
      description: 'Información empresarial y estado de tu solicitud.',
    },
    {
      id: 'documentos',
      segment: 'documents',
      title: 'Documentos',
      description: 'Los soportes legales que Suminia revisa y la declaración de autocontrol.',
    },
    {
      id: 'contacto',
      segment: 'contacts',
      title: 'Contactos',
      description: 'Las personas de cada área y los correos donde recibes las órdenes de compra.',
    },
    {
      id: 'condiciones',
      segment: 'terms',
      title: 'Condiciones y pagos',
      description: 'Lo que exiges para despachar un pedido y la cuenta donde recibes tus pagos.',
    },
  ],
  buyer: [
    {
      id: 'empresa',
      segment: '',
      title: 'Mi empresa',
      description: 'Información empresarial y estado de tu solicitud.',
    },
    {
      id: 'documentos',
      segment: 'documents',
      title: 'Documentos',
      description: 'Los soportes legales que Suminia revisa para aprobar tu empresa.',
    },
    {
      id: 'contacto',
      segment: 'contacts',
      title: 'Contactos',
      description: 'Las personas de tu organización con las que Suminia coordina compras, pagos y entregas.',
    },
    {
      id: 'perfil',
      segment: 'profile',
      title: 'Perfil y medio de pago',
      description: 'Quién es tu organización y con qué cuenta pagas tus pedidos.',
    },
  ],
};

/* En que subseccion vive cada panel con ancla. */
const SECTION_OF: Record<SectionId, CompanySection> = {
  [SECTION.electronicInvoicing]: 'empresa',
  [SECTION.info]: 'empresa',
  [SECTION.warehouses]: 'empresa',
  [SECTION.profile]: 'empresa',
  [SECTION.documents]: 'documentos',
  [SECTION.contacts]: 'contacto',
  [SECTION.orderEmails]: 'contacto',
  [SECTION.bank]: 'condiciones',
  [SECTION.buyerNature]: 'perfil',
  [SECTION.buyerPayment]: 'perfil',
};

export const companyPath = (kind: OrganizationKind, section: CompanySection): string => {
  const meta = COMPANY_SECTIONS[kind].find((item) => item.id === section);
  const base = `/${kind}/account/company`;
  return meta?.segment ? `${base}/${meta.segment}` : base;
};

/* A donde lleva un panel: su pagina y su ancla. */
export const sectionHref = (kind: OrganizationKind, section: SectionId): string =>
  `${companyPath(kind, SECTION_OF[section])}#${section}`;

/* La subseccion de un ancla, o null si no es de un panel de Mi empresa. Sirve
   a los enlaces viejos, que llevaban todo a /company#<panel>. */
export const sectionOfAnchor = (anchor: string): CompanySection | null =>
  SECTION_OF[anchor as SectionId] ?? null;
