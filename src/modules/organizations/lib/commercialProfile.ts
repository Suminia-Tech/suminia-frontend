import type {
  BuyerActivity,
  ContactArea,
  IpsSector,
  LegalNature,
  OrganizationDocumentType,
  SupplierActivity,
  SupplierProductLine,
} from '../model/organization.types';

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

export interface LegalDocumentOption {
  value: OrganizationDocumentType;
  label: string;
  help: string;
  /* Sin el, Suminia no aprueba la empresa. */
  required: boolean;
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
    {
      value: 'SHAREHOLDING',
      label: 'Certificado de composición accionaria',
      help: 'Firmado por el revisor fiscal o el representante legal.',
      required: esComprador,
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

/* Las opciones del perfil del comprador, en el orden de la hoja. */
export const LEGAL_NATURE_OPTIONS: { value: LegalNature; label: string }[] = [
  { value: 'LEGAL_ENTITY', label: 'Persona jurídica' },
  { value: 'NATURAL_PERSON', label: 'Persona natural' },
];

export const BUYER_ACTIVITY_OPTIONS: Record<
  LegalNature,
  { value: BuyerActivity; label: string }[]
> = {
  LEGAL_ENTITY: [
    { value: 'IPS', label: 'IPS (clínica, hospital, centro médico)' },
    { value: 'CLINICAL_LABORATORY', label: 'Laboratorio clínico' },
    { value: 'DIAGNOSTIC_CENTER', label: 'Centro de diagnóstico / imágenes' },
    { value: 'PHARMACY', label: 'Droguería o establecimiento farmacéutico' },
    { value: 'NON_PROFIT', label: 'Fundación / entidad sin ánimo de lucro' },
    {
      value: 'NON_HEALTH_ENTITY',
      label: 'Entidad con objeto social diferente a la prestación de servicios de salud',
    },
    { value: 'PRIVATE_COMPANY', label: 'Empresa / entidad privada' },
    { value: 'OTHER', label: 'Otra' },
  ],
  NATURAL_PERSON: [
    { value: 'INDEPENDENT_PROFESSIONAL', label: 'Profesional independiente de salud' },
    { value: 'OTHER', label: 'Otra' },
  ],
};

export const IPS_SECTOR_OPTIONS: { value: IpsSector; label: string }[] = [
  { value: 'PUBLIC', label: 'Pública' },
  { value: 'MIXED', label: 'Mixta' },
  { value: 'PRIVATE', label: 'Privada' },
];

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
  documents?: { type: OrganizationDocumentType }[];
}): string[] => {
  const faltan: string[] = [];
  if (!organization.legalNature || !organization.buyerActivity) {
    faltan.push('la naturaleza y la actividad de tu organización');
  }
  if (!organization.bankName || !organization.bankAccountNumber) {
    faltan.push('el banco y el número de cuenta de tu medio de pago');
  }
  const subidos = new Set((organization.documents ?? []).map((d) => d.type));
  for (const opcion of legalDocumentOptions('buyer', organization.legalNature)) {
    if (opcion.required && !subidos.has(opcion.value)) {
      faltan.push(opcion.label.toLowerCase());
    }
  }
  return faltan;
};
