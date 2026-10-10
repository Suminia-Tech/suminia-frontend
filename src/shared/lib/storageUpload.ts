import type { UploadTicket } from '../api/types';

/* La subida directa a S3 que comparten las imagenes y documentos de producto y
   los documentos legales de una empresa. */

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

/* Manda el archivo a S3 con la politica ya firmada. Los campos van primero y
   en orden, y el archivo de ultimo: S3 lee el formulario en streaming y aplica
   la politica en cuanto la encuentra, de modo que un archivo que llega antes
   se procesa sin las condiciones puestas. */
export const uploadToStorage = async (
  ticket: UploadTicket,
  file: File,
  /* Como se llama lo que se sube en los mensajes: "la imagen", "el documento". */
  noun: string,
): Promise<void> => {
  const form = new FormData();
  Object.entries(ticket.fields).forEach(([key, value]) => form.append(key, value));
  form.append('file', file);

  /* fetch lanza TypeError sin detalle cuando el navegador corta la peticion
     antes de dejarla salir, que en la practica siempre es CORS: el bucket no
     permite este origen. El mensaje propio de fetch —"Failed to fetch"— no dice
     nada, y el archivo puede haber llegado igual: S3 responde 204 pero el
     navegador oculta la respuesta, de modo que la confirmacion no llega a
     correr y el objeto queda huerfano. */
  let response: Response;
  try {
    response = await fetch(ticket.uploadUrl, { method: 'POST', body: form });
  } catch {
    throw new Error(
      'El almacenamiento rechazó la conexión desde esta dirección. Revisa el CORS del bucket.',
    );
  }

  if (!response.ok) {
    /* S3 contesta los errores en XML, no en JSON. El codigo es lo unico que
       vale la pena leer; el resto es ruido para el usuario. */
    const body = await response.text();
    const code = /<Code>(.*?)<\/Code>/.exec(body)?.[1];

    if (code === 'EntityTooLarge') {
      throw new Error(`${capitalize(noun)} supera el tamaño permitido`);
    }
    if (code === 'AccessDenied') {
      throw new Error('El permiso de subida expiró. Intenta de nuevo.');
    }
    throw new Error(`No se pudo subir ${noun} al almacenamiento`);
  }
};

export const formatMegabytes = (bytes: number): string =>
  `${Math.round(bytes / (1024 * 1024))} MB`;
