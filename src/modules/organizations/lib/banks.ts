/* Los bancos entre los que elige el proveedor la cuenta donde se le paga.

   Bancolombia y Davivienda van aparte y primero: con ellos los pagos de
   Suminia salen mas rapido y con menos costo financiero. A quien maneja varios
   bancos le sirve saberlo al elegir.

   El backend guarda el banco como texto libre, de modo que se manda el nombre
   tal cual y una cuenta registrada antes de la lista sigue valiendo: si su
   banco no esta aqui, se muestra como "Otro". */
export const RECOMMENDED_BANKS = ['Bancolombia', 'Davivienda'];

export const OTHER_BANKS = [
  'Banco Agrario',
  'Banco AV Villas',
  'Banco Caja Social',
  'Banco de Bogotá',
  'Banco de Occidente',
  'Banco Falabella',
  'Banco Finandina',
  'Banco GNB Sudameris',
  'Banco Pichincha',
  'Banco Popular',
  'Banco Serfinanza',
  'Bancoomeva',
  'BBVA Colombia',
  'Itaú',
  'Lulo Bank',
  'Scotiabank Colpatria',
];

export const isListedBank = (name: string): boolean =>
  RECOMMENDED_BANKS.includes(name) || OTHER_BANKS.includes(name);
