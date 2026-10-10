import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useGetDocumentUrlMutation } from '../api/productsApi';

/* Abre un documento en otra pestaña con un enlace firmado que caduca a los
   cinco minutos.

   La pestaña se abre antes de pedir el enlace, dentro del mismo clic: abrirla
   despues de esperar la respuesta ya no cuenta como gesto del usuario, y el
   navegador la bloquea como ventana emergente. */
export const useOpenDocument = (productId: string) => {
  const [getDocumentUrl] = useGetDocumentUrlMutation();
  const [opening, setOpening] = useState<string | null>(null);

  const open = useCallback(
    async (documentId: string) => {
      const tab = window.open('', '_blank');
      setOpening(documentId);

      try {
        const { data } = await getDocumentUrl({ productId, documentId }).unwrap();
        if (tab) tab.location.href = data.url;
        else window.location.href = data.url;
      } catch (err) {
        tab?.close();
        toast.error(extractErrorMessage(err, 'No se pudo abrir el documento.'));
      } finally {
        setOpening(null);
      }
    },
    [productId, getDocumentUrl],
  );

  return { open, opening };
};
