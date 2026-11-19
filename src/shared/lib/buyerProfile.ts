/* Quien es el comprador: su naturaleza juridica, a que se dedica y la cuenta
   con la que paga. Lo piden dos sitios —el registro y Mi empresa— y las
   opciones tienen que ser las mismas en los dos: viven aqui. */

export type LegalNature = 'LEGAL_ENTITY' | 'NATURAL_PERSON';

export type BuyerActivity =
  | 'IPS'
  | 'CLINICAL_LABORATORY'
  | 'DIAGNOSTIC_CENTER'
  | 'PHARMACY'
  | 'NON_PROFIT'
  | 'NON_HEALTH_ENTITY'
  | 'PRIVATE_COMPANY'
  | 'INDEPENDENT_PROFESSIONAL'
  | 'OTHER';

export type IpsSector = 'PUBLIC' | 'MIXED' | 'PRIVATE';

/* En el orden de la hoja de Suminia. */
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
