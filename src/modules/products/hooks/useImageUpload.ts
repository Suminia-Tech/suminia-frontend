import { useCallback, useState } from 'react';

import { extractErrorMessage } from '@/shared/lib/apiError';

import {
  useConfirmImageMutation,
  useCreateImageUploadUrlMutation,
} from '../api/productsApi';
import type { UploadTicket } from '../model/product.types';

/* Debe coincidir con allowedImageMimeTypes del backend. Se valida aqui solo
   para dar un mensaje inmediato: quien decide de verdad es la politica firmada,
   que S3 hace cumplir aunque el cliente mienta. */
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

const EXTENSIONS = 'JPG, PNG, WEBP o GIF';

/* Manda el archivo a S3 con la politica ya firmada. Los campos van primero y
   en orden, y el archivo de ultimo: S3 lee el formulario en streaming y aplica
   la politica en cuanto la encuentra, de modo que un archivo que llega antes
   se procesa sin las condiciones puestas. */
const uploadToStorage = async (ticket: UploadTicket, file: File): Promise<void> => {
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
      throw new Error('La imagen supera el tamaño permitido');
    }
    if (code === 'AccessDenied') {
      throw new Error('El permiso de subida expiró. Intenta de nuevo.');
    }
    throw new Error('No se pudo subir la imagen al almacenamiento');
  }
};

const formatMegabytes = (bytes: number): string =>
  `${Math.round(bytes / (1024 * 1024))} MB`;

/* Subir una imagen son tres pasos y no uno:

     1. la API firma un permiso temporal
     2. el navegador manda el archivo directo a S3
     3. la API confirma y guarda la fila

   Se encapsula aqui para que las pantallas solo llamen upload(file). El paso 2
   no pasa por RTK Query a proposito: no va contra nuestra API, no tiene cache
   que invalidar y no debe llevar el token de sesion. */
export const useImageUpload = (productId: string) => {
  const [createUploadUrl] = useCreateImageUploadUrlMutation();
  const [confirmImage] = useConfirmImageMutation();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File, alt?: string): Promise<boolean> => {
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Formato no admitido. Usa ${EXTENSIONS}.`);
        return false;
      }

      setUploading(true);
      try {
        const { data: ticket } = await createUploadUrl({
          productId,
          contentType: file.type,
        }).unwrap();

        /* El limite lo manda el backend dentro del permiso. Comprobarlo aqui
           evita mandar a S3 un archivo que va a rechazar. */
        if (file.size > ticket.maxBytes) {
          setError(`La imagen supera ${formatMegabytes(ticket.maxBytes)}.`);
          return false;
        }

        await uploadToStorage(ticket, file);

        await confirmImage({
          productId,
          data: { storageKey: ticket.storageKey, alt },
        }).unwrap();

        return true;
      } catch (err: unknown) {
        /* Los errores propios de S3 ya vienen como Error con texto util; los
           de nuestra API son objetos de RTK Query y hay que desenvolverlos. */
        setError(
          err instanceof Error
            ? err.message
            : extractErrorMessage(err, 'No se pudo subir la imagen'),
        );
        return false;
      } finally {
        setUploading(false);
      }
    },
    [productId, createUploadUrl, confirmImage],
  );

  return { upload, uploading, error, clearError: () => setError(null) };
};
