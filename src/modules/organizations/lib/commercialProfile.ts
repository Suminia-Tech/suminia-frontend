import type {
  ContactArea,
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

export const LEGAL_DOCUMENT_OPTIONS: {
  value: OrganizationDocumentType;
  label: string;
  help: string;
}[] = [
  {
    value: 'CHAMBER_OF_COMMERCE',
    label: 'Certificado de existencia y representación legal',
    help: 'Expedido por la Cámara de Comercio hace no más de 30 días.',
  },
  { value: 'RUT', label: 'RUT', help: 'El Registro Único Tributario vigente.' },
  {
    value: 'SHAREHOLDING',
    label: 'Certificado de composición accionaria',
    help: 'Firmado por el revisor fiscal o el representante legal.',
  },
  {
    value: 'LEGAL_REPRESENTATIVE_ID',
    label: 'Cédula del representante legal',
    help: 'Por ambas caras, en un solo archivo.',
  },
];
