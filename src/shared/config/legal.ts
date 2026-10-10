/* Quien responde por los datos personales ante la ley, y desde cuando rige la
   politica. Un solo sitio para los dos porque la pagina de la politica y los
   formularios que la citan tienen que decir lo mismo.

   Solo lo que esta confirmado: faltan el NIT, la direccion y el telefono del
   responsable, que la Ley 1581 pide publicar. Se añaden aqui cuando la empresa
   los tenga, en vez de publicar un dato inventado. */
export const DATA_RESPONSIBLE = {
  name: 'Suminia',
  email: 'soporte@suminia.io',
  country: 'Colombia',
} as const;

export const DATA_POLICY_EFFECTIVE_DATE = '10 de octubre de 2026';

/* La ruta publica de la politica. */
export const DATA_POLICY_PATH = '/data-policy';
