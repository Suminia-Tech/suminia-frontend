import type { SelectOption } from '@/shared/ui/SelectWithCustom';

/* Datos regulatorios de un medicamento en Colombia.

   Los nombres siguen los del dataset oficial de medicamentos vigentes del
   INVIMA —principioactivo, formafarmaceutica, viaadministracion, atc— para que
   cruzar contra el algun dia no obligue a traducir.

   El reparto entre producto y formato no es una decision nuestra: el CUM es el
   expediente del registro sanitario mas un consecutivo por presentacion
   comercial, de modo que un mismo medicamento tiene un CUM distinto por cada
   formato en que se vende. Por eso el registro y la composicion van en el
   producto, y el CUM en el formato. */

export interface MedicineField {
  key: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: (string | SelectOption)[];
  help?: string;
}

/* Formas y vias tomadas de las que usa el propio dataset. La lista queda
   abierta: hay decenas y el catalogo ira pidiendo las que falten. */
const FORMAS_FARMACEUTICAS = [
  'Tableta',
  'Tableta recubierta',
  'Cápsula',
  'Jarabe',
  'Suspensión oral',
  'Solución inyectable',
  'Polvo para inyección',
  'Crema',
  'Ungüento',
  'Gotas',
  'Supositorio',
  'Parche',
];

const VIAS_ADMINISTRACION = [
  'Oral',
  'Intravenosa',
  'Intramuscular',
  'Subcutánea',
  'Tópica',
  'Oftálmica',
  'Ótica',
  'Nasal',
  'Rectal',
  'Inhalatoria',
];

export const MEDICINE_FIELDS: MedicineField[] = [
  {
    key: 'principioActivo',
    label: 'Principio activo',
    placeholder: 'Hidroclorotiazida',
    required: true,
    help: 'Es por lo que se busca un medicamento, más que por la marca.',
  },
  {
    key: 'concentracion',
    label: 'Concentración',
    placeholder: '25 mg',
    required: true,
  },
  {
    key: 'formaFarmaceutica',
    label: 'Forma farmacéutica',
    required: true,
    options: FORMAS_FARMACEUTICAS,
  },
  {
    key: 'viaAdministracion',
    label: 'Vía de administración',
    required: true,
    options: VIAS_ADMINISTRACION,
  },
  {
    key: 'registroSanitario',
    label: 'Registro sanitario INVIMA',
    placeholder: 'INVIMA 2023M-0013598-R2',
    required: true,
  },
  {
    key: 'atc',
    label: 'Código ATC',
    placeholder: 'C09DX01',
    required: false,
    help: 'Clasificación anatómico-terapéutica. Opcional.',
  },
];

export const MEDICINE_KEYS = MEDICINE_FIELDS.map((field) => field.key);

/* El CUM se escribe expediente-consecutivo. El expediente son los digitos del
   registro sanitario; el consecutivo distingue cada presentacion comercial. */
export const CUM_PATTERN = /^\d{4,12}-\d{1,4}$/;

export const isValidCum = (cum: string): boolean =>
  cum.trim() === '' || CUM_PATTERN.test(cum.trim());
