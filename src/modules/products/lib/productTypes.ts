import type { ProductDocumentType, ProductType } from '../model/product.types';

/* Los grupos regulatorios. El proveedor no los ve como tales: elige una
   categoria, y cada categoria pertenece a uno —lo fija Suminia al crearla—. La
   ayuda es lo que aparece bajo la categoria elegida, para que sepa por que se
   le pide lo que se le pide. */
export const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string; help: string }[] = [
  {
    value: 'MEDICAL_DEVICE',
    label: 'Dispositivo médico',
    help: 'Pide registro sanitario, ficha técnica y, si lo fabricas o importas, el CCAA.',
  },
  {
    value: 'MEDICINE',
    label: 'Medicamento',
    help: 'Se elige del catálogo del INVIMA: el registro sanitario se toma de ahí.',
  },
  {
    value: 'IN_VITRO_DIAGNOSTIC',
    label: 'Reactivos y diagnóstico in vitro',
    help: 'Pide registro sanitario, marca y referencia.',
  },
  {
    value: 'HOSPITAL_SUPPLY',
    label: 'Insumos hospitalarios',
    help: 'Pide registro sanitario, marca y referencia.',
  },
  {
    value: 'DISINFECTANT',
    label: 'Desinfectantes',
    help: 'Pide registro sanitario, marca y referencia.',
  },
];

/* Lo que se le dice al proveedor bajo la categoria que eligio. */
export const PRODUCT_TYPE_HELP = Object.fromEntries(
  PRODUCT_TYPE_OPTIONS.map((option) => [option.value, option.help]),
) as Record<ProductType, string>;

export const PRODUCT_TYPE_LABEL = Object.fromEntries(
  PRODUCT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<ProductType, string>;

export const DOCUMENT_LABEL: Record<ProductDocumentType, string> = {
  SANITARY_REGISTRATION: 'Registro sanitario',
  TECHNICAL_SHEET: 'Ficha técnica',
  CCAA: 'CCAA',
};

export const DOCUMENT_HELP: Record<ProductDocumentType, string> = {
  SANITARY_REGISTRATION: 'El certificado del INVIMA que respalda este dispositivo.',
  TECHNICAL_SHEET: 'La ficha del fabricante para esta referencia.',
  CCAA: 'Certificado de capacidad de almacenamiento y acondicionamiento.',
};

/* Los soportes que se exigen. Debe coincidir con requiredDocuments del
   backend, que es quien lo hace cumplir al enviar a revision: aqui solo sirve
   para pintar los huecos y no ofrecer un envio que va a acabar en 422. */
export const requiredDocuments = (
  type: ProductType,
  isManufacturerOrImporter: boolean,
): ProductDocumentType[] => {
  if (type !== 'MEDICAL_DEVICE') return [];

  return [
    'SANITARY_REGISTRATION',
    'TECHNICAL_SHEET',
    ...(isManufacturerOrImporter ? (['CCAA'] as const) : []),
  ];
};
