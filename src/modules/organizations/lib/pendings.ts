import type { Organization } from '../model/organization.types';
import { buyerMissing, LEGAL_DOCUMENT_OPTIONS } from './commercialProfile';

/* Lo que le falta a una empresa por llenar, cada cosa con el panel donde se
   resuelve.

   Vive en un solo sitio porque lo leen dos pantallas que tienen que decir lo
   mismo: el Resumen, que lo lista y enlaza, y el formulario de Mi empresa, que
   marca el panel. Si cada una tuviera su propia regla, el Resumen podria pedir
   algo que el formulario no señala. */

/* El id de cada panel de Mi empresa. El enlace del Resumen lleva a
   /…/account/company#<id> y la pantalla se desplaza hasta ahi. */
export const SECTION = {
  info: 'informacion-empresa',
  documents: 'documentos-legales',
  profile: 'perfil-comercial',
  contacts: 'contactos',
  orderEmails: 'correos-ordenes',
  bank: 'cuenta-pagos',
  buyerNature: 'naturaleza',
  buyerPayment: 'medio-de-pago',
} as const;

export type PendingKey =
  | 'declaration'
  | 'profile'
  | 'bank'
  | 'city'
  | 'orderEmails'
  | 'contacts'
  | 'documents'
  | 'buyerNature'
  | 'buyerPayment';

export interface Pending {
  key: PendingKey;
  /** La frase del Resumen. */
  texto: string;
  /** El enlace que la acompaña. */
  enlace: string;
  /** A donde lleva: pagina y panel. */
  href: string;
  /** Lo que se dice dentro del panel, junto al campo vacio. */
  aviso: string;
}

const COMPANY = '/supplier/account/company';

/* Los cinco datos de la cuenta van juntos: o estan todos o no hay cuenta. */
const tieneCuenta = (org: Organization) =>
  [
    org.bankName,
    org.bankAccountType,
    org.bankAccountNumber,
    org.bankAccountHolder,
    org.bankAccountHolderTaxId,
  ].every(Boolean);

export const supplierPendings = (supplier: Organization): Pending[] => {
  const pendientes: (Pending | false)[] = [
    /* La declaracion va primero: sin ella Suminia no puede aprobar la
       empresa, y lo demas se completa igual despues. */
    supplier.status === 'PENDING' &&
      !supplier.declaration && {
        key: 'declaration',
        texto:
          'Falta tu declaración de autocontrol de riesgos (SAGRILAFT): sin ella no podemos aprobar tu empresa.',
        enlace: 'Llenar la declaración',
        href: '/supplier/account/declaration',
        aviso: 'Falta enviar la declaración.',
      },
    !supplier.activities?.length &&
      !supplier.productLines?.length && {
        key: 'profile',
        texto: 'Falta contar qué haces y qué categorías de productos vendes.',
        enlace: 'Completar el perfil',
        href: `${COMPANY}#${SECTION.profile}`,
        aviso: 'Falta llenar tus actividades y las categorías de productos que comercializas.',
      },
    !tieneCuenta(supplier) && {
      key: 'bank',
      texto: 'Falta la cuenta bancaria donde Suminia te paga las ventas.',
      enlace: 'Añadir la cuenta',
      href: `${COMPANY}#${SECTION.bank}`,
      aviso: 'Falta llenar la cuenta: sin ella Suminia no puede pagarte tus ventas.',
    },
    !supplier.city && {
      key: 'city',
      texto: 'Falta la ciudad desde la que despachas.',
      enlace: 'Completar los datos',
      href: `${COMPANY}#${SECTION.info}`,
      aviso: 'Falta llenar la ciudad desde la que despachas.',
    },
    !supplier.orderEmails?.length && {
      key: 'orderEmails',
      texto: 'Falta el correo al que deben llegar las órdenes de compra.',
      enlace: 'Añadir el correo',
      href: `${COMPANY}#${SECTION.orderEmails}`,
      aviso: 'Falta llenar al menos un correo para recibir las órdenes de compra.',
    },
    !supplier.contacts?.length && {
      key: 'contacts',
      texto: 'Faltan las personas de contacto de tus áreas.',
      enlace: 'Añadir contactos',
      href: `${COMPANY}#${SECTION.contacts}`,
      aviso: 'Falta llenar al menos una persona de contacto.',
    },
    (supplier.documents?.length ?? 0) < LEGAL_DOCUMENT_OPTIONS.length && {
      key: 'documents',
      texto: 'Faltan documentos legales para verificar tu empresa.',
      enlace: 'Subir documentos',
      href: `${COMPANY}#${SECTION.documents}`,
      aviso: 'Faltan documentos por subir: los marcados abajo.',
    },
  ];

  return pendientes.filter((p): p is Pending => Boolean(p));
};

/* Lo mismo del lado del comprador, sobre la misma regla que buyerMissing: lo
   que Suminia necesita para aprobarlo. Las anclas son de su propia pagina. */
export const buyerPendings = (buyer: Organization): Pending[] => {
  const pendientes: Pending[] = [];
  const company = '/buyer/account/company';

  if (!buyer.legalNature || !buyer.buyerActivity) {
    pendientes.push({
      key: 'buyerNature',
      texto: 'Falta la naturaleza y la actividad de tu organización.',
      enlace: 'Completar',
      href: `${company}#${SECTION.buyerNature}`,
      aviso: 'Falta llenar la naturaleza de tu organización y su actividad.',
    });
  }
  if (!buyer.bankName || !buyer.bankAccountNumber) {
    pendientes.push({
      key: 'buyerPayment',
      texto: 'Falta el banco y el número de cuenta de tu medio de pago.',
      enlace: 'Añadir la cuenta',
      href: `${company}#${SECTION.buyerPayment}`,
      aviso: 'Falta llenar el banco y el número de cuenta.',
    });
  }

  /* Los documentos que faltan son los que buyerMissing nombra despues de los
     dos datos de arriba. Se agrupan en un solo pendiente: el panel ya marca
     cada uno. */
  const documentosFaltantes = buyerMissing(buyer).length - pendientes.length;
  if (documentosFaltantes > 0) {
    pendientes.push({
      key: 'documents',
      texto:
        documentosFaltantes === 1
          ? 'Falta un documento legal obligatorio.'
          : `Faltan ${documentosFaltantes} documentos legales obligatorios.`,
      enlace: 'Subir documentos',
      href: `${company}#${SECTION.documents}`,
      aviso: 'Faltan documentos obligatorios por subir: los marcados abajo.',
    });
  }

  return pendientes;
};

/* El aviso de un panel, o undefined si en ese panel no falta nada. */
export const avisoDe = (pendientes: Pending[], key: PendingKey): string | undefined =>
  pendientes.find((p) => p.key === key)?.aviso;
