import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import type { UploadTicket } from '@/shared/api/types';
import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatMegabytes, uploadToStorage } from '@/shared/lib/storageUpload';

/* Debe coincidir con allowedDocumentMimeTypes del backend. PDF, que es como
   los emiten la Camara de Comercio, la DIAN y los bancos, y foto para quien
   solo tiene el papel escaneado. */
export const DOCUMENT_ACCEPT = 'application/pdf,image/jpeg,image/png';
const ALLOWED_TYPES = DOCUMENT_ACCEPT.split(',');

/* Lo que cambia de un documento a otro: contra que ruta se pide el permiso,
   se confirma y se abre. Lo demas es igual para la empresa del proveedor, la
   del comprador y cada sede. */
export interface DocumentEndpoints<T extends string> {
  requestUpload: (contentType: string) => Promise<UploadTicket>;
  confirm: (type: T, storageKey: string, filename: string) => Promise<unknown>;
  getUrl: (documentId: string) => Promise<string>;
}

/* Subir y abrir un documento. Los mismos tres pasos que los de producto
   —permiso, subida directa a S3, confirmacion—; subir uno del mismo tipo
   reemplaza al anterior, y eso lo resuelve el backend. */
export const useDocumentFlow = <T extends string>(endpoints: DocumentEndpoints<T>) => {
  /* El tipo que se esta subiendo, y no un booleano: hay un hueco por tipo y
     solo debe girar el que corresponde. */
  const [uploading, setUploading] = useState<T | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { requestUpload, confirm, getUrl } = endpoints;

  const upload = useCallback(
    async (type: T, file: File): Promise<boolean> => {
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Sube el documento en PDF, JPG o PNG.');
        return false;
      }

      setUploading(type);
      try {
        const ticket = await requestUpload(file.type);

        if (file.size > ticket.maxBytes) {
          setError(`El documento supera ${formatMegabytes(ticket.maxBytes)}.`);
          return false;
        }

        await uploadToStorage(ticket, file, 'el documento');
        await confirm(type, ticket.storageKey, file.name);
        return true;
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : extractErrorMessage(err, 'No se pudo subir el documento'),
        );
        return false;
      } finally {
        setUploading(null);
      }
    },
    [requestUpload, confirm],
  );

  /* La pestaña se abre antes de pedir el enlace, dentro del mismo clic:
     abrirla despues de esperar la respuesta ya no cuenta como gesto del
     usuario, y el navegador la bloquea como ventana emergente. */
  const open = useCallback(
    async (documentId: string) => {
      const tab = window.open('', '_blank');
      setOpening(documentId);

      try {
        (tab ?? window).location.assign(await getUrl(documentId));
      } catch (err) {
        tab?.close();
        toast.error(extractErrorMessage(err, 'No se pudo abrir el documento.'));
      } finally {
        setOpening(null);
      }
    },
    [getUrl],
  );

  return { upload, uploading, open, opening, error, clearError: () => setError(null) };
};
