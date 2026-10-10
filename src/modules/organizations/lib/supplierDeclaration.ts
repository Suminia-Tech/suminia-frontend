import type { InternationalOperationType } from '../model/organization.types';

/* Los textos de la declaracion, tal como los firma el proveedor. Viven aqui y
   no en la pantalla porque la ficha interna los cita al mostrar lo que acepto. */

/* A donde se escribe para cambiar la declaracion una vez revisada. */
export const SUPPORT_EMAIL = 'soporte@suminia.io';

export const DECLARATION_TITLE = 'Sistema de Autocontrol y Gestión de Riesgos LA/FT/FP y C/ST';

export const LAWFUL_ORIGIN = {
  title: 'Origen lícito',
  text: 'Declaro que los recursos, bienes y fondos que utilizaré en el desarrollo de la relación comercial con Suminia provienen de actividades lícitas y de fuentes legítimas, y que no tienen origen directo o indirecto en actividades relacionadas con el lavado de activos, la financiación del terrorismo o la financiación de la proliferación de armas de destrucción masiva.',
};

export const LAWFUL_USE = {
  title: 'Uso lícito de recursos',
  text: 'Declaro que los recursos y bienes utilizados en las operaciones con Suminia no serán destinados, directa o indirectamente, a actividades ilícitas ni a la financiación de actividades relacionadas con el lavado de activos, la financiación del terrorismo, la financiación de la proliferación de armas de destrucción masiva, la corrupción o el soborno transnacional.',
};

export const LISTS_AUTHORIZATION = {
  title: 'Listas y verificaciones',
  text: 'Declaro que la empresa que represento, sus beneficiarios finales y las demás personas que deban ser objeto de verificación conforme a la legislación aplicable y las políticas de Suminia no se encuentran incluidos en las Listas Vinculantes aplicables en Colombia. Autorizo a Suminia para realizar consultas y verificaciones en listas vinculantes, listas restrictivas, fuentes públicas y demás fuentes de información legalmente accesibles, así como para realizar las validaciones necesarias para la prevención y gestión de los riesgos de LA/FT/FP y C/ST.',
};

export const TRUTHFUL_INFORMATION = {
  title: 'Información veraz y actualización',
  text: 'Declaro que la información suministrada a Suminia es verdadera, completa y actualizada, y me comprometo a informar oportunamente cualquier cambio relevante que pueda afectar la relación comercial o la evaluación de riesgos realizada por Suminia.',
};

export const PEP_QUESTION =
  '¿El representante legal, alguno de los beneficiarios finales, administradores o personas vinculadas a la empresa tiene o ha tenido la calidad de Persona Expuesta Políticamente (PEP), de acuerdo con la normativa colombiana?';

export const DATA_POLICY_TEXT =
  'He leído y acepto la Política de Tratamiento de Datos Personales de Suminia y autorizo el tratamiento de mis datos personales de acuerdo con ella.';

export const MARKETING_TEXT =
  'Autorizo a Suminia para enviarme información sobre nuevos productos, promociones, ofertas, lanzamientos, novedades, contenidos y otros beneficios comerciales relacionados con sus servicios, a través de los canales que seleccione.';

export const INTERNATIONAL_OPERATION_OPTIONS: {
  value: InternationalOperationType;
  label: string;
}[] = [
  { value: 'IMPORTS', label: 'Importaciones' },
  { value: 'EXPORTS', label: 'Exportaciones' },
  { value: 'FOREIGN_SUPPLIER_PAYMENTS', label: 'Pagos a proveedores del exterior' },
  { value: 'FOREIGN_CUSTOMER_COLLECTIONS', label: 'Recaudo de clientes del exterior' },
  { value: 'INTERNATIONAL_TRANSFERS', label: 'Transferencias internacionales' },
  { value: 'OTHER', label: 'Otras' },
];

/* Las monedas que se marcan con una casilla; cualquier otra se escribe. */
export const LISTED_CURRENCIES = ['USD', 'EUR'] as const;

export const describeOperations = (
  types: InternationalOperationType[],
  other: string | null,
): string =>
  INTERNATIONAL_OPERATION_OPTIONS.filter((option) => types.includes(option.value))
    .map((option) => (option.value === 'OTHER' && other ? `Otras: ${other}` : option.label))
    .join(', ');
