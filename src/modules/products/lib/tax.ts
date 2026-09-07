import type { TaxCategory } from '../model/product.types';

/* Tratamiento tributario, para pintarlo y para elegirlo.

   No se deduce del tipo de producto: en Colombia los medicamentos estan
   excluidos de IVA por el articulo 424 del Estatuto Tributario, pero entre los
   insumos medicos hay gravados al 19%, al 5% y excluidos. Solo el proveedor
   sabe cual le toca a cada uno.

   Excluido y exento se parecen —el comprador no paga IVA en ninguno— pero no
   son lo mismo: el exento da derecho a descontar el IVA de los insumos y el
   excluido no. Se ofrecen por separado porque son cuentas distintas. */

interface TaxOption {
  value: TaxCategory;
  label: string;
  help: string;
  rate: number;
}

export const TAX_OPTIONS: TaxOption[] = [
  {
    value: 'IVA_19',
    label: 'IVA 19%',
    help: 'La tarifa general. Es lo habitual en insumos médicos.',
    rate: 0.19,
  },
  {
    value: 'IVA_5',
    label: 'IVA 5%',
    help: 'Tarifa reducida para algunos bienes con tratamiento especial.',
    rate: 0.05,
  },
  {
    value: 'EXCLUIDO',
    label: 'Excluido de IVA',
    help: 'No causa IVA. Es el caso de los medicamentos (artículo 424 del Estatuto Tributario).',
    rate: 0,
  },
  {
    value: 'EXENTO',
    label: 'Exento de IVA',
    help: 'Tarifa cero, pero con derecho a descontar el IVA de los insumos.',
    rate: 0,
  },
];

const BY_VALUE = new Map(TAX_OPTIONS.map((option) => [option.value, option]));

export const taxLabel = (category: TaxCategory): string =>
  BY_VALUE.get(category)?.label ?? category;

export const taxRate = (category: TaxCategory): number =>
  BY_VALUE.get(category)?.rate ?? 0;

/* Lo que se propone al crear: casi todo medicamento esta excluido y casi todo
   insumo va al 19%. Acertar por defecto evita el error mas caro —publicar con
   el impuesto equivocado— sin impedir corregirlo. */
export const defaultTaxCategory = (type: string): TaxCategory =>
  type === 'MEDICINE' ? 'EXCLUIDO' : 'IVA_19';

/* Lo que el comprador acaba pagando por unidad. Se muestra junto al precio
   porque un 19% sobre una compra grande no es un detalle. */
export const priceWithTax = (price: number, category: TaxCategory): number =>
  price * (1 + taxRate(category));
