import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useDownloadPurchaseOrderPdfMutation } from '../api/ordersApi';

/* Descargar la orden de compra en PDF. Como la cotizacion: la URL de objeto
   se libera en cuanto el navegador toma el archivo. */
export const usePurchaseOrderPdf = () => {
  const [fetchPdf] = useDownloadPurchaseOrderPdfMutation();
  const [downloading, setDownloading] = useState(false);

  const download = useCallback(
    async (id: string, code: string) => {
      setDownloading(true);
      try {
        const url = await fetchPdf(id).unwrap();
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `${code}.pdf`;
        enlace.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err) {
        toast.error(extractErrorMessage(err, 'No se pudo descargar la orden de compra.'));
      } finally {
        setDownloading(false);
      }
    },
    [fetchPdf],
  );

  return { download, downloading };
};
