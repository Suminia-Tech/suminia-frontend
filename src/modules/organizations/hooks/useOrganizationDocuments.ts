import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatMegabytes, uploadToStorage } from '@/shared/lib/storageUpload';

import {
  useConfirmSupplierDocumentMutation,
  useCreateSupplierDocumentUploadUrlMutation,
  useGetSupplierDocumentUrlMutation,
} from '../api/suppliersApi';
import type { OrganizationDocumentType } from '../model/organization.types';

/* Debe coincidir con allowedDocumentMimeTypes del backend. PDF, que es como
   los emite la Camara de Comercio y la DIAN, y foto para quien solo tiene el
   papel escaneado. */
export const LEGAL_DOCUMENT_ACCEPT = 'application/pdf,image/jpeg,image/png';
const ALLOWED_TYPES = LEGAL_DOCUMENT_ACCEPT.split(',');

/* Subir y abrir los documentos legales de un proveedor. Los mismos tres pasos
   que los de producto —permiso, subida directa a S3, confirmacion—; subir uno
   del mismo tipo reemplaza al anterior, y eso lo resuelve el backend. */
export const useSupplierDocuments = (supplierId: string) => {
  const [createUploadUrl] = useCreateSupplierDocumentUploadUrlMutation();
  const [confirmDocument] = useConfirmSupplierDocumentMutation();
  const [getDocumentUrl] = useGetSupplierDocumentUrlMutation();

  /* El tipo que se esta subiendo, y no un booleano: hay un hueco por tipo y
     solo debe girar el que corresponde. */
  const [uploading, setUploading] = useState<OrganizationDocumentType | null>(null);
  const [opening, setOpening] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (type: OrganizationDocumentType, file: File): Promise<boolean> => {
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Sube el documento en PDF, JPG o PNG.');
        return false;
      }

      setUploading(type);
      try {
        const { data: ticket } = await createUploadUrl({
          supplierId,
          contentType: file.type,
        }).unwrap();

        if (file.size > ticket.maxBytes) {
          setError(`El documento supera ${formatMegabytes(ticket.maxBytes)}.`);
          return false;
        }

        await uploadToStorage(ticket, file, 'el documento');

        await confirmDocument({
          supplierId,
          data: { type, storageKey: ticket.storageKey, filename: file.name },
        }).unwrap();

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
    [supplierId, createUploadUrl, confirmDocument],
  );

  /* La pestaña se abre antes de pedir el enlace, dentro del mismo clic:
     abrirla despues de esperar la respuesta ya no cuenta como gesto del
     usuario, y el navegador la bloquea como ventana emergente. */
  const open = useCallback(
    async (documentId: string) => {
      const tab = window.open('', '_blank');
      setOpening(documentId);

      try {
        const { data } = await getDocumentUrl({ supplierId, documentId }).unwrap();
        if (tab) tab.location.href = data.url;
        else window.location.href = data.url;
      } catch (err) {
        tab?.close();
        toast.error(extractErrorMessage(err, 'No se pudo abrir el documento.'));
      } finally {
        setOpening(null);
      }
    },
    [supplierId, getDocumentUrl],
  );

  return { upload, uploading, open, opening, error, clearError: () => setError(null) };
};
