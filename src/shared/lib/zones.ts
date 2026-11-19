/* La zona de la ciudad en la que queda una sede. La elige el comprador al
   crear la sede, porque es quien sabe donde queda, y el personal de Suminia la
   corrige desde la ficha del comprador si hace falta.

   Solo se pide en las ciudades que se dividen en zonas, y ahi es obligatoria:
   opcional casi nadie la llenaria y el filtro quedaria vacio justo donde
   importa. En un municipio pequeño "Norte" no significa nada, asi que ni se
   pregunta. La misma lista esta en el backend.

   Aqui y no en un modulo porque la usan dos: las sedes la guardan y el filtro
   de pedidos la busca. */

export type Zone = 'NORTH' | 'SOUTH' | 'CENTER' | 'EAST' | 'WEST';

export const ZONE_LABEL: Record<Zone, string> = {
  NORTH: 'Norte',
  SOUTH: 'Sur',
  CENTER: 'Centro',
  EAST: 'Oriente',
  WEST: 'Occidente',
};

export const ZONES = Object.keys(ZONE_LABEL) as Zone[];

/* Ningun nombre se repite en otro departamento salvo Bogota, que es su propio
   departamento: basta el nombre de la ciudad. */
export const ZONED_CITIES: readonly string[] = [
  'Bogotá, D.C.',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Cúcuta',
  'Pereira',
  'Ibagué',
  'Santa Marta',
  'Villavicencio',
  'Manizales',
];

export const hasZones = (city: string | null | undefined): boolean =>
  !!city && ZONED_CITIES.includes(city);
