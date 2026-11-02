import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatMegabytes, uploadToStorage } from '@/shared/lib/storageUpload';

import { useGetPayoutFileUrlMutation, useRequestPayoutUploadMutation } from '../api/financeApi';
import type { PayoutFileKind } from '../model/finance.types';

/* Debe coincidir con allowedDocumentMimeTypes del backend. */
export const FILE_ACCEPT = 'application/pdf,image/jpeg,image/png';
const ALLOWED = FILE_ACCEPT.split(',');

/* Subir y abrir los archivos de una liquidacion: el comprobante de la
   transferencia y la factura de la comision. */
export const usePayoutFiles = (payoutId: string) => {
  const [requestUpload] = useRequestPayoutUploadMutation();
  const [getUrl] = useGetPayoutFileUrlMutation();
  const [uploading, setUploading] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);

  const upload = useCallback(
    async (kind: PayoutFileKind, file: File) => {
      if (!ALLOWED.includes(file.type)) throw new Error('Súbelo en PDF, JPG o PNG.');
      setUploading(true);
      try {
        const ticket = (
          await requestUpload({ id: payoutId, kind, contentType: file.type }).unwrap()
        ).data;
        if (file.size > ticket.maxBytes) {
          throw new Error(`El archivo supera ${formatMegabytes(ticket.maxBytes)}.`);
        }
        await uploadToStorage(ticket, file, 'el archivo');
        return { storageKey: ticket.storageKey, filename: file.name };
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : extractErrorMessage(err, 'No se pudo subir el archivo'),
        );
      } finally {
        setUploading(false);
      }
    },
    [payoutId, requestUpload],
  );

  /* La pestaña se abre dentro del mismo clic, o el navegador la bloquea. */
  const open = useCallback(
    async (key: string) => {
      const tab = window.open('', '_blank');
      setOpening(key);
      try {
        const { url } = (await getUrl({ id: payoutId, key }).unwrap()).data;
        (tab ?? window).location.assign(url);
      } catch (err) {
        tab?.close();
        toast.error(extractErrorMessage(err, 'No se pudo abrir el archivo.'));
      } finally {
        setOpening(null);
      }
    },
    [payoutId, getUrl],
  );

  return { upload, uploading, open, opening };
};
