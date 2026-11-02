/* Los filtros de analisis del personal de Suminia sobre el catalogo. Van por
   tramos y no con campos de numero: lo que se pregunta es "cuantos productos
   baratos hay" o "quien esta sin inventario", no un rango exacto, y un tramo
   se elige desde la misma barra de desplegables. */

interface Range {
  key: string;
  label: string;
}

/* El precio de cualquiera de sus presentaciones, antes de IVA. */
export const PRICE_RANGES: (Range & { min?: number; max?: number })[] = [
  { key: 'hasta-20k', label: 'Hasta $20.000', max: 20_000 },
  { key: '20k-100k', label: '$20.000 a $100.000', min: 20_000, max: 100_000 },
  { key: '100k-500k', label: '$100.000 a $500.000', min: 100_000, max: 500_000 },
  { key: 'mas-500k', label: 'Más de $500.000', min: 500_000 },
];

/* Los mismos tramos que entiende el backend. */
export const PRESENTATION_RANGES: Range[] = [
  { key: '0', label: 'Sin presentaciones' },
  { key: '1', label: '1 presentación' },
  { key: '2-3', label: '2 a 3 presentaciones' },
  { key: '4+', label: '4 o más presentaciones' },
];

/* La suma del inventario de todas sus presentaciones. */
export const STOCK_RANGES: Range[] = [
  { key: 'out', label: 'Sin existencias' },
  { key: 'low', label: '1 a 50 unidades' },
  { key: 'mid', label: '51 a 500 unidades' },
  { key: 'high', label: 'Más de 500 unidades' },
];

export const rangeLabel = (ranges: Range[], key: string) =>
  ranges.find((range) => range.key === key)?.label ?? key;
