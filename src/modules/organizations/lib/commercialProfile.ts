import type {
  ActivityLines,
  BuyerActivity,
  ContactArea,
  IpsSector,
  LegalNature,
  OrganizationDocument,
  OrganizationDocumentType,
  SupplierActivity,
  SupplierProductLine,
} from '../model/organization.types';
import { isDelivered } from './documentStatus';

/* Las opciones en el orden en que se le preguntan al proveedor. */
export const ACTIVITY_OPTIONS: { value: SupplierActivity; label: string }[] = [
  { value: 'MANUFACTURER', label: 'Fabricante' },
  { value: 'IMPORTER', label: 'Importador' },
  { value: 'DISTRIBUTOR', label: 'Distribuidor' },
];

export const PRODUCT_LINE_OPTIONS: { value: SupplierProductLine; label: string }[] = [
  { value: 'MEDICAL_DEVICES', label: 'Dispositivos médicos' },
  { value: 'IN_VITRO_DIAGNOSTICS', label: 'Reactivos de diagnóstico in vitro' },
  { value: 'HOSPITAL_SUPPLIES', label: 'Insumos hospitalarios' },
  { value: 'CLEANING_DISINFECTION', label: 'Aseo y desinfección' },
  { value: 'BIOMEDICAL_EQUIPMENT', label: 'Equipos biomédicos' },
  { value: 'HOSPITAL_FURNITURE', label: 'Mobiliario hospitalario' },
  { value: 'MEDICINES', label: 'Medicamentos' },
];

/* Para leer una lista marcada en una sola linea, en el orden de las opciones y
   no en el que se marcaron. */
const describe = <T extends string>(
  options: { value: T; label: string }[],
  selected: T[] | undefined,
): string | null => {
  const labels = options
    .filter((option) => (selected ?? []).includes(option.value))
    .map((option) => option.label);
  return labels.length > 0 ? labels.join(', ') : null;
};

export const describeActivities = (selected: SupplierActivity[] | undefined) =>
  describe(ACTIVITY_OPTIONS, selected);

export const describeProductLines = (selected: SupplierProductLine[] | undefined) =>
  describe(PRODUCT_LINE_OPTIONS, selected);

/* Que vende en cada actividad, en una linea por actividad: "Fabricante:
   Mobiliario hospitalario". Con un perfil viejo, sin la relacion, cae a las
   dos listas sueltas. */
export const describeActivityLines = (organization: {
  activityLines?: ActivityLines[];
  activities?: SupplierActivity[];
  productLines?: SupplierProductLine[];
}): string[] => {
  const relacion = (organization.activityLines ?? []).filter((l) => l.productLines.length > 0);
  if (relacion.length === 0) {
    const actividades = describeActivities(organization.activities);
    const lineas = describeProductLines(organization.productLines);
    return actividades || lineas ? [[actividades, lineas].filter(Boolean).join(': ')] : [];
  }
  return ACTIVITY_OPTIONS.flatMap((option) => {
    const entrada = relacion.find((l) => l.activity === option.value);
    return entrada ? [`${option.label}: ${describeProductLines(entrada.productLines)}`] : [];
  });
};

export const describeExporter = (
  exporter: boolean | null | undefined,
): string | null =>
  exporter === null || exporter === undefined ? null : exporter ? 'Sí' : 'No';

/* Las areas en el orden en que se piden: primero con quien se vende, al final
   quien decide. */
export const CONTACT_AREA_OPTIONS: { value: ContactArea; label: string }[] = [
  { value: 'COMMERCIAL', label: 'Comercial' },
  { value: 'LOGISTICS', label: 'Logística' },
  { value: 'BILLING', label: 'Facturación' },
  { value: 'COLLECTIONS', label: 'Cartera' },
  { value: 'MANAGEMENT', label: 'Gerencia' },
];

/* Las del comprador, en el orden de la hoja de Suminia. El responsable
   tecnico es quien responde por que lo recibido cumple: el quimico
   farmaceutico, el ingeniero biomedico, el instrumentador quirurgico o el
   bacteriologo, segun lo que compre la institucion. */
export const BUYER_CONTACT_AREA_OPTIONS: { value: ContactArea; label: string }[] = [
  { value: 'PURCHASING_LEAD', label: 'Líder de compras' },
  { value: 'PURCHASING_ASSISTANT', label: 'Auxiliar de compras' },
  { value: 'ACCOUNTING', label: 'Contabilidad' },
  { value: 'TREASURY', label: 'Tesorería' },
  { value: 'MANAGEMENT', label: 'Gerencia' },
  {
    value: 'TECHNICAL_LEAD',
    label: 'Químico farmacéutico / Ingeniero biomédico / Instrumentador quirúrgico / Bacteriólogo',
  },
  { value: 'WAREHOUSE', label: 'Responsable del almacén o recepción de mercancía' },
];

/* Las que admiten varias personas; las demas, una. Los auxiliares no son
   obligatorios: una clinica pequeña no los tiene. */
export const MULTI_CONTACT_AREAS: ContactArea[] = ['PURCHASING_ASSISTANT'];

/* El nombre de un area: el de la sugerida, o el que le puso la empresa. */
export const contactAreaLabel = (contact: {
  area: ContactArea;
  customArea?: string | null;
}): string =>
  contact.area === 'OTHER'
    ? (contact.customArea ?? 'Otra área')
    : ([...CONTACT_AREA_OPTIONS, ...BUYER_CONTACT_AREA_OPTIONS].find(
        (option) => option.value === contact.area,
      )?.label ?? contact.area);

export interface LegalDocumentOption {
  value: OrganizationDocumentType;
  label: string;
  help: string;
  /* Sin el, Suminia no aprueba la empresa. */
  required: boolean;
  /* Solo se sube si Suminia lo pide, o si aplica: sin cargar no es un
     faltante. */
  onRequest?: boolean;
  /* Como se marca mientras no se ha subido: "Opcional" por defecto. */
  optionalLabel?: string;
}

/* Los documentos que se le piden a cada lado, con la ayuda que va debajo.

   El comprador sube ademas el certificado bancario, y su certificado de
   existencia puede tener hasta 90 dias; al proveedor se le piden 30. Una
   persona natural no tiene camara de comercio de sociedad ni composicion
   accionaria, de modo que no se le piden. La misma regla que el backend
   (requiredBuyerDocuments), repetida aqui para pintar los huecos. */
export const legalDocumentOptions = (
  kind: 'supplier' | 'buyer',
  legalNature?: LegalNature | null,
): LegalDocumentOption[] => {
  const esComprador = kind === 'buyer';
  const natural = esComprador && legalNature === 'NATURAL_PERSON';

  const opciones: LegalDocumentOption[] = [
    {
      value: 'LEGAL_REPRESENTATIVE_ID',
      label: natural ? 'Cédula' : 'Cédula del representante legal',
      help: 'Por ambas caras, en un solo archivo.',
      required: esComprador,
    },
    {
      value: 'CHAMBER_OF_COMMERCE',
      label: 'Certificado de existencia y representación legal',
      help: `Expedido por la Cámara de Comercio hace no más de ${esComprador ? 90 : 30} días.`,
      required: esComprador,
    },
    {
      value: 'RUT',
      label: 'RUT',
      help: 'El Registro Único Tributario vigente.',
      required: esComprador,
    },
    /* No se exige: los accionistas y beneficiarios finales ya van en la
       declaracion. Se sube solo si Suminia lo pide para una revision mas
       profunda. */
    {
      value: 'SHAREHOLDING',
      label: 'Certificado de composición accionaria',
      help: 'Solo si Suminia te lo solicita. Firmado por el revisor fiscal o el representante legal.',
      required: false,
      onRequest: true,
    },
  ];

  /* El certificado bancario lo suben los dos: prueba que la cuenta es de la
     empresa, la del comprador para pagar y la del proveedor para cobrar. */
  opciones.push({
    value: 'BANK_CERTIFICATE',
    label: 'Certificado bancario',
    help: esComprador
      ? 'Actualizado, de la cuenta que registraste como medio de pago.'
      : 'Actualizado, de la cuenta donde Suminia te paga tus ventas.',
    required: esComprador,
  });

  return natural
    ? opciones.filter((o) => o.value !== 'CHAMBER_OF_COMMERCE' && o.value !== 'SHAREHOLDING')
    : opciones;
};

/* Los del proveedor, que no dependen de nada. */
export const LEGAL_DOCUMENT_OPTIONS = legalDocumentOptions('supplier');

/* Las certificaciones sanitarias del proveedor. Ninguna se exige: no todos
   fabrican, importan o almacenan, y cada una aplica a quien hace eso. Se
   suben cuando aplican, y Suminia las revisa como los documentos legales. */
export const SANITARY_CERTIFICATION_OPTIONS: LegalDocumentOption[] = [
  {
    value: 'CCAA',
    label: 'Certificado de Capacidad de Almacenamiento y Acondicionamiento (CCAA)',
    help: 'Expedido por el INVIMA. Aplica si fabricas o importas dispositivos médicos.',
    required: false,
    onRequest: true,
    optionalLabel: 'Si aplica',
  },
  {
    value: 'GMP_CERTIFICATE',
    label: 'Certificado de Buenas Prácticas de Manufactura (BPM)',
    help: 'Expedido por el INVIMA. Aplica si fabricas.',
    required: false,
    onRequest: true,
    optionalLabel: 'Si aplica',
  },
  {
    value: 'GSP_CERTIFICATE',
    label: 'Certificado de Buenas Prácticas de Almacenamiento (BPA)',
    help: 'Aplica si almacenas medicamentos o dispositivos médicos.',
    required: false,
    onRequest: true,
    optionalLabel: 'Si aplica',
  },
  {
    value: 'HEALTH_AUTHORITY_VISIT',
    label: 'Acta de visita del ente territorial de salud',
    help: 'La última acta de la secretaría de salud de tu departamento o municipio.',
    required: false,
    onRequest: true,
    optionalLabel: 'Si aplica',
  },
];

/* Las opciones del perfil del comprador: las mismas del registro. */
export {
  BUYER_ACTIVITY_OPTIONS,
  IPS_SECTOR_OPTIONS,
  LEGAL_NATURE_OPTIONS,
} from '@/shared/lib/buyerProfile';
import {
  BUYER_ACTIVITY_OPTIONS,
  IPS_SECTOR_OPTIONS,
  LEGAL_NATURE_OPTIONS,
} from '@/shared/lib/buyerProfile';

/* El perfil en una linea: "Persona jurídica · IPS (clínica...) · Privada". */
export const describeBuyerProfile = (organization: {
  legalNature?: LegalNature | null;
  buyerActivity?: BuyerActivity | null;
  ipsSector?: IpsSector | null;
  activityOther?: string | null;
}): string | null => {
  const { legalNature, buyerActivity } = organization;
  if (!legalNature || !buyerActivity) return null;

  const naturaleza = LEGAL_NATURE_OPTIONS.find((o) => o.value === legalNature)?.label;
  const actividad =
    buyerActivity === 'OTHER'
      ? organization.activityOther
      : BUYER_ACTIVITY_OPTIONS[legalNature].find((o) => o.value === buyerActivity)?.label;
  const sector = IPS_SECTOR_OPTIONS.find((o) => o.value === organization.ipsSector)?.label;

  return [naturaleza, actividad, sector].filter(Boolean).join(' · ');
};

/* Lo que le falta a un comprador para que Suminia lo apruebe. La misma regla
   que missingForBuyerApproval en el backend, para decirselo antes de que lo
   descubra al esperar. */
export const buyerMissing = (organization: {
  legalNature?: LegalNature | null;
  buyerActivity?: BuyerActivity | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  documents?: OrganizationDocument[];
  declaration?: { beneficialOwners?: unknown[] } | null;
}): string[] => {
  const faltan: string[] = [];
  if (!organization.legalNature || !organization.buyerActivity) {
    faltan.push('la naturaleza y la actividad de tu organización');
  }
  if (!organization.bankName || !organization.bankAccountNumber) {
    faltan.push('el banco y el número de cuenta de tu medio de pago');
  }
  /* Un rechazado no cuenta: hay que volver a subirlo. */
  const subidos = new Set((organization.documents ?? []).filter(isDelivered).map((d) => d.type));
  for (const opcion of legalDocumentOptions('buyer', organization.legalNature)) {
    if (opcion.required && !subidos.has(opcion.value)) {
      faltan.push(opcion.label.toLowerCase());
    }
  }
  /* La misma declaracion que firma el proveedor; sin ella el backend no
     aprueba. */
  if (!organization.declaration) {
    faltan.push('la declaración de autocontrol');
  } else if (!organization.declaration.beneficialOwners?.length) {
    faltan.push('los accionistas y beneficiarios finales en la declaración');
  }
  return faltan;
};
