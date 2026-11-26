import type { ContactArea, Organization } from '../model/organization.types';
import {
  BUYER_CONTACT_AREA_OPTIONS,
  buyerMissing,
  CONTACT_AREA_OPTIONS,
  LEGAL_DOCUMENT_OPTIONS,
  MULTI_CONTACT_AREAS,
} from './commercialProfile';
import { companyPath, sectionHref, SECTION } from './companySections';
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
  | 'paymentTerms'
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
   no son obligatorias. En el proveedor el contacto ademas tiene que tener
   celular: es lo que pide Suminia para aprobarlo. */
const areasSinContacto = (
  org: Organization,
  options: { value: ContactArea; label: string }[],
  conCelular = false,
): string[] =>
  options
    .filter(
      (option) =>
        !MULTI_CONTACT_AREAS.includes(option.value) &&
        !org.contacts?.some(
          (contact) => contact.area === option.value && (!conCelular || Boolean(contact.phone)),
        ),
    )
    .map((option) => option.label);

/* "del área Comercial" o "de las áreas Comercial, Logística y Cartera". */
const faltaContactoDe = (areas: string[]): string =>
  areas.length === 1
    ? `Falta el contacto del área ${areas[0]}.`
    : `Falta el contacto de las áreas ${areas.slice(0, -1).join(', ')} y ${areas.at(-1)}.`;

/* La declaracion cuenta como hecha cuando trae los accionistas y
   beneficiarios finales: una firmada antes de que se pidieran tiene que
   completarse. */
const declaracionCompleta = (org: Organization) =>
  Boolean(org.declaration?.beneficialOwners?.length);

const declaracionPendiente = (org: Organization, href: string): Pending =>
  org.declaration
    ? {
        key: 'declaration',
        texto:
          'Falta completar en tu declaración los accionistas y beneficiarios finales: sin ellos no podemos aprobar tu empresa.',
        enlace: 'Completar la declaración',
        href,
        aviso: 'Faltan los accionistas y beneficiarios finales.',
      }
    : {
        key: 'declaration',
        texto:
          'Falta tu declaración de autocontrol de riesgos (SAGRILAFT): sin ella no podemos aprobar tu empresa.',
        enlace: 'Llenar la declaración',
        href,
        aviso: 'Falta enviar la declaración.',
      };

export const supplierPendings = (supplier: Organization): Pending[] => {
  const sinContacto = areasSinContacto(supplier, CONTACT_AREA_OPTIONS, true);
  const faltaContacto = faltaContactoDe(sinContacto);

  const pendientes: (Pending | false)[] = [
    /* La declaracion va primero: sin ella Suminia no puede aprobar la
       empresa, y lo demas se completa igual despues. */
    supplier.status === 'PENDING' &&
      !declaracionCompleta(supplier) &&
      declaracionPendiente(supplier, '/supplier/account/declaration'),
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
        aviso: 'Falta definir tus actividades y las líneas de productos de cada una.',
      },
    !tieneCuenta(supplier) && {
      key: 'bank',
      texto: 'Falta la cuenta bancaria donde Suminia te paga las ventas.',
      enlace: 'Añadir la cuenta',
      href: sectionHref('supplier', SECTION.bank),
      aviso: 'Falta llenar la cuenta: sin ella Suminia no puede pagarte tus ventas.',
    },
    /* Requisito para aprobar, pero no para guardar: se avisa aqui y no se
       bloquea el formulario, que guarda todas las pestañas a la vez. */
    supplier.paymentTermDays == null && {
      key: 'paymentTerms',
      texto: 'Falta indicar si vendes de contado o a crédito.',
      enlace: 'Indicar la condición de pago',
      href: companyPath('supplier', 'condiciones'),
      aviso: 'Falta indicar si vendes de contado o a crédito.',
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
    /* Cada area necesita a alguien con nombre, correo y celular; puede ser
       la misma persona para varias. Sin ellos Suminia no aprueba. */
    sinContacto.length > 0 && {
      key: 'contacts',
      texto: `${faltaContacto} Sin los contactos de cada área no podemos aprobar tu empresa.`,
      enlace: 'Añadir contactos',
      href: sectionHref('supplier', SECTION.contacts),
      aviso: `${faltaContacto} Cada uno con nombre, correo y celular; una misma persona puede encargarse de varias áreas.`,
    },
    /* Lo que nunca se subio, lo rechazado y lo vencido: en los tres casos
       la empresa tiene que subir un archivo. */
    LEGAL_DOCUMENT_OPTIONS.some((option) => {
      const slot = documentSlot(supplier.documents, option.value);
      /* El que se sube a pedido no falta mientras no se haya subido. */
      return needsAction(slot) && !(option.onRequest && slot.state === 'MISSING');
    }) && {
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
  if (buyer.status === 'PENDING' && !declaracionCompleta(buyer)) {
    pendientes.push(declaracionPendiente(buyer, '/buyer/account/declaration'));
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
    Number(!declaracionCompleta(buyer));
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
