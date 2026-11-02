import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useDownloadQuotePdfMutation } from '../api/ordersApi';

/* Descargar el PDF de una cotizacion. Llega como URL de objeto y se libera en
   cuanto el navegador la toma: si no, cada descarga deja el archivo en
   memoria hasta que se cierre la pestaña. */
export const useQuotePdf = () => {
  const [fetchPdf] = useDownloadQuotePdfMutation();
  const [downloading, setDownloading] = useState<string | null>(null);

  const download = useCallback(
    async (id: string, code: string) => {
      setDownloading(id);
      try {
        const url = await fetchPdf(id).unwrap();
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `${code}.pdf`;
        enlace.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err) {
        toast.error(extractErrorMessage(err, 'No se pudo descargar la cotización.'));
      } finally {
        setDownloading(null);
      }
    },
    [fetchPdf],
  );

  return { download, downloading };
};
