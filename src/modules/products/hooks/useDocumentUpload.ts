import { useCallback, useState } from 'react';

import { extractErrorMessage } from '@/shared/lib/apiError';

import {
  useConfirmDocumentMutation,
  useCreateDocumentUploadUrlMutation,
} from '../api/productsApi';
import { formatMegabytes, uploadToStorage } from '@/shared/lib/storageUpload';
import type { ProductDocumentType } from '../model/product.types';

/* Debe coincidir con allowedDocumentMimeTypes del backend. PDF, que es como
   los emite el INVIMA, y foto para quien solo tiene el papel escaneado. */
export const DOCUMENT_ACCEPT = 'application/pdf,image/jpeg,image/png';
const ALLOWED_TYPES = DOCUMENT_ACCEPT.split(',');

/* Los mismos tres pasos que una imagen —permiso, subida directa a S3,
   confirmacion—, con su tipo de documento. Subir uno del mismo tipo reemplaza
   al anterior: eso lo resuelve el backend. */
export const useDocumentUpload = (productId: string) => {
  const [createUploadUrl] = useCreateDocumentUploadUrlMutation();
  const [confirmDocument] = useConfirmDocumentMutation();

  /* El tipo que se esta subiendo, y no un booleano: la pantalla tiene un hueco
     por tipo y solo debe girar el que corresponde. */
  const [uploading, setUploading] = useState<ProductDocumentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (type: ProductDocumentType, file: File): Promise<boolean> => {
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Sube el documento en PDF, JPG o PNG.');
        return false;
      }

      setUploading(type);
      try {
        const { data: ticket } = await createUploadUrl({
          productId,
          contentType: file.type,
        }).unwrap();

        if (file.size > ticket.maxBytes) {
          setError(`El documento supera ${formatMegabytes(ticket.maxBytes)}.`);
          return false;
        }

        await uploadToStorage(ticket, file, 'el documento');

        await confirmDocument({
          productId,
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
    [productId, createUploadUrl, confirmDocument],
  );

  return { upload, uploading, error, clearError: () => setError(null) };
};
