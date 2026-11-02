import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatMegabytes, uploadToStorage } from '@/shared/lib/storageUpload';

import {
  useGetOrderFileUrlMutation,
  useRequestOrderUploadMutation,
} from '../api/ordersApi';
import type { OrderFileKind } from '../model/order.types';

/* Debe coincidir con allowedDocumentMimeTypes del backend: un comprobante o
   una factura llegan en PDF, o como foto del papel. */
export const FILE_ACCEPT = 'application/pdf,image/jpeg,image/png';
const ALLOWED = FILE_ACCEPT.split(',');

export interface UploadedFile {
  storageKey: string;
  filename: string;
}

/* Subir y abrir los archivos de un pedido: el comprobante del comprador, la
   factura del proveedor, la devolucion de Suminia. Los mismos pasos que los
   documentos de una empresa —permiso, subida directa, y la confirmacion la
   hace quien llama con lo que devuelve aqui—. */
export const useOrderFiles = (orderId: string) => {
  const [requestUpload] = useRequestOrderUploadMutation();
  const [getUrl] = useGetOrderFileUrlMutation();
  const [uploading, setUploading] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);

  const upload = useCallback(
    async (kind: OrderFileKind, file: File): Promise<UploadedFile> => {
      if (!ALLOWED.includes(file.type)) {
        throw new Error('Súbelo en PDF, JPG o PNG.');
      }
      setUploading(true);
      try {
        const ticket = (
          await requestUpload({ id: orderId, kind, contentType: file.type }).unwrap()
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
    [orderId, requestUpload],
  );

  /* La pestaña se abre dentro del mismo clic: abrirla despues de esperar el
     enlace ya no cuenta como gesto del usuario y el navegador la bloquea. */
  const open = useCallback(
    async (key: string) => {
      const tab = window.open('', '_blank');
      setOpening(key);
      try {
        const { url } = (await getUrl({ id: orderId, key }).unwrap()).data;
        (tab ?? window).location.assign(url);
      } catch (err) {
        tab?.close();
        toast.error(extractErrorMessage(err, 'No se pudo abrir el archivo.'));
      } finally {
        setOpening(null);
      }
    },
    [orderId, getUrl],
  );

  return { upload, uploading, open, opening };
};
