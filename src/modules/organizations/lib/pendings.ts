import type { ContactArea, Organization } from '../model/organization.types';
import {
  BUYER_CONTACT_AREA_OPTIONS,
  buyerMissing,
  CONTACT_AREA_OPTIONS,
  LEGAL_DOCUMENT_OPTIONS,
  MULTI_CONTACT_AREAS,
} from './commercialProfile';
import { sectionHref, SECTION } from './companySections';
import { documentSlot, needsAction } from './documentStatus';

/* Lo que le falta a una empresa por llenar, cada cosa con el panel donde se
   resuelve.

   Vive en un solo sitio porque lo leen dos pantallas que tienen que decir lo
   mismo: el Resumen, que lo lista y enlaza, y el formulario de Mi empresa, que
   marca el panel. Si cada una tuviera su propia regla, el Resumen podria pedir
   algo que el formulario no señala. */

export { SECTION } from './companySections';

export type PendingKey =
  | 'declaration'
  | 'electronicInvoicing'
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


/* Los cinco datos de la cuenta van juntos: o estan todos o no hay cuenta. */
const tieneCuenta = (org: Organization) =>
  [
    org.bankName,
    org.bankAccountType,
    org.bankAccountNumber,
    org.bankAccountHolder,
    org.bankAccountHolderTaxId,
  ].every(Boolean);

/* Las areas obligatorias que nadie cubre. Las que admiten varias personas
   no son obligatorias. */
const areasSinContacto = (
  org: Organization,
  options: { value: ContactArea; label: string }[],
): string[] =>
  options
    .filter(
      (option) =>
        !MULTI_CONTACT_AREAS.includes(option.value) &&
        !org.contacts?.some((contact) => contact.area === option.value),
    )
    .map((option) => option.label);

/* "del área Comercial" o "de las áreas Comercial, Logística y Cartera". */
const faltaContactoDe = (areas: string[]): string =>
  areas.length === 1
    ? `Falta el contacto del área ${areas[0]}.`
    : `Falta el contacto de las áreas ${areas.slice(0, -1).join(', ')} y ${areas.at(-1)}.`;

export const supplierPendings = (supplier: Organization): Pending[] => {
  const sinContacto = areasSinContacto(supplier, CONTACT_AREA_OPTIONS);
  const faltaContacto = faltaContactoDe(sinContacto);

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
    /* Despues de la declaracion y antes que el resto: es la otra condicion
       sin la cual no se aprueba. Un "no" tambien queda pendiente, porque
       mientras lo sea no hay aprobacion posible. */
    supplier.issuesElectronicInvoices !== true && {
      key: 'electronicInvoicing',
      texto:
        supplier.issuesElectronicInvoices === false
          ? 'Suminia solo trabaja con proveedores que expiden factura electrónica: sin ella no podemos aprobar tu empresa.'
          : 'Falta responder si tu empresa expide factura electrónica.',
      enlace: 'Responder',
      href: sectionHref('supplier', SECTION.electronicInvoicing),
      aviso:
        supplier.issuesElectronicInvoices === false
          ? 'Sin factura electrónica no podemos aprobar tu empresa.'
          : 'Falta responder esta pregunta.',
    },
    !supplier.activities?.length &&
      !supplier.productLines?.length && {
        key: 'profile',
        texto: 'Falta contar qué haces y qué categorías de productos vendes.',
        enlace: 'Completar el perfil',
        href: sectionHref('supplier', SECTION.profile),
        aviso: 'Falta llenar tus actividades y las categorías de productos que comercializas.',
      },
    !tieneCuenta(supplier) && {
      key: 'bank',
      texto: 'Falta la cuenta bancaria donde Suminia te paga las ventas.',
      enlace: 'Añadir la cuenta',
      href: sectionHref('supplier', SECTION.bank),
      aviso: 'Falta llenar la cuenta: sin ella Suminia no puede pagarte tus ventas.',
    },
    !supplier.city && {
      key: 'city',
      texto: 'Falta la ciudad de tu oficina principal.',
      enlace: 'Completar los datos',
      href: sectionHref('supplier', SECTION.info),
      aviso: 'Falta llenar la ciudad de tu oficina principal.',
    },
    !supplier.orderEmails?.length && {
      key: 'orderEmails',
      texto: 'Falta el correo al que deben llegar las órdenes de compra.',
      enlace: 'Añadir el correo',
      href: sectionHref('supplier', SECTION.orderEmails),
      aviso: 'Falta llenar al menos un correo para recibir las órdenes de compra.',
    },
    /* Cada area necesita a alguien; puede ser la misma persona para varias. */
    sinContacto.length > 0 && {
      key: 'contacts',
      texto: faltaContacto,
      enlace: 'Añadir contactos',
      href: sectionHref('supplier', SECTION.contacts),
      aviso: `${faltaContacto} Una misma persona puede encargarse de varias áreas.`,
    },
    /* Lo que nunca se subio, lo rechazado y lo vencido: en los tres casos
       la empresa tiene que subir un archivo. */
    LEGAL_DOCUMENT_OPTIONS.some((option) =>
      needsAction(documentSlot(supplier.documents, option.value)),
    ) && {
      key: 'documents',
      texto: 'Hay documentos legales por subir, corregir o renovar.',
      enlace: 'Revisar documentos',
      href: sectionHref('supplier', SECTION.documents),
      aviso: 'Hay documentos por subir, corregir o renovar: los marcados abajo.',
    },
  ];

  return pendientes.filter((p): p is Pending => Boolean(p));
};

/* Lo mismo del lado del comprador, sobre la misma regla que buyerMissing: lo
   que Suminia necesita para aprobarlo. Las anclas son de su propia pagina. */
export const buyerPendings = (buyer: Organization): Pending[] => {
  const pendientes: Pending[] = [];

  /* Primero, como en el proveedor: sin ella Suminia no puede aprobar. */
  if (buyer.status === 'PENDING' && !buyer.declaration) {
    pendientes.push({
      key: 'declaration',
      texto:
        'Falta tu declaración de autocontrol de riesgos (SAGRILAFT): sin ella no podemos aprobar tu empresa.',
      enlace: 'Llenar la declaración',
      href: '/buyer/account/declaration',
      aviso: 'Falta enviar la declaración.',
    });
  }

  if (!buyer.legalNature || !buyer.buyerActivity) {
    pendientes.push({
      key: 'buyerNature',
      texto: 'Falta la naturaleza y la actividad de tu organización.',
      enlace: 'Completar',
      href: sectionHref('buyer', SECTION.buyerNature),
      aviso: 'Falta llenar la naturaleza de tu organización y su actividad.',
    });
  }
  if (!buyer.bankName || !buyer.bankAccountNumber) {
    pendientes.push({
      key: 'buyerPayment',
      texto: 'Falta el banco y el número de cuenta de tu medio de pago.',
      enlace: 'Añadir la cuenta',
      href: sectionHref('buyer', SECTION.buyerPayment),
      aviso: 'Falta llenar el banco y el número de cuenta.',
    });
  }

  /* Los documentos que faltan son lo que buyerMissing nombra ademas de los
     dos datos de arriba y la declaracion. Se agrupan en un solo pendiente: el
     panel ya marca cada uno. */
  const otrosFaltantes =
    Number(!buyer.legalNature || !buyer.buyerActivity) +
    Number(!buyer.bankName || !buyer.bankAccountNumber) +
    Number(!buyer.declaration);
  const documentosFaltantes = buyerMissing(buyer).length - otrosFaltantes;
  if (documentosFaltantes > 0) {
    pendientes.push({
      key: 'documents',
      texto:
        documentosFaltantes === 1
          ? 'Falta un documento legal obligatorio.'
          : `Faltan ${documentosFaltantes} documentos legales obligatorios.`,
      enlace: 'Subir documentos',
      href: sectionHref('buyer', SECTION.documents),
      aviso: 'Faltan documentos obligatorios por subir: los marcados abajo.',
    });
  }

  /* No impide la aprobacion, como en el proveedor: es con quien habla
     Suminia, y se puede completar despues. */
  const sinContacto = areasSinContacto(buyer, BUYER_CONTACT_AREA_OPTIONS);
  if (sinContacto.length > 0) {
    const faltaContacto = faltaContactoDe(sinContacto);
    pendientes.push({
      key: 'contacts',
      texto: faltaContacto,
      enlace: 'Añadir contactos',
      href: sectionHref('buyer', SECTION.contacts),
      aviso: `${faltaContacto} Una misma persona puede encargarse de varias áreas.`,
    });
  }

  return pendientes;
};

/* El aviso de un panel, o undefined si en ese panel no falta nada. */
export const avisoDe = (pendientes: Pending[], key: PendingKey): string | undefined =>
  pendientes.find((p) => p.key === key)?.aviso;
