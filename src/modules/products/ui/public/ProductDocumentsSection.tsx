'use client';

import { ExternalLink, FileText } from 'react-feather';
import { toast } from 'react-toastify';
import { useState } from 'react';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useGetPublicDocumentUrlMutation } from '../../api/productsApi';
import { DOCUMENT_LABEL } from '../../lib/productTypes';
import type { ProductDocument } from '../../model/product.types';

interface ProductDocumentsSectionProps {
  productId: string;
  documents: ProductDocument[];
}

/* El registro sanitario y la ficha tecnica, para abrirlos desde la ficha. Es
   lo primero que pide un comprador del sector antes de comprar un dispositivo.

   Se abren con un enlace firmado que caduca a los cinco minutos. La pestaña se
   abre dentro del mismo clic y despues se le pone la direccion: abrirla al
   volver la respuesta ya no cuenta como gesto del usuario, y el navegador la
   bloquea como ventana emergente. */
export const ProductDocumentsSection = ({ productId, documents }: ProductDocumentsSectionProps) => {
  const [getUrl] = useGetPublicDocumentUrlMutation();
  const [abriendo, setAbriendo] = useState<string | null>(null);

  if (documents.length === 0) return null;

  const abrir = async (documentId: string) => {
    const tab = window.open('', '_blank');
    setAbriendo(documentId);
    try {
      const { data } = await getUrl({ productId, documentId }).unwrap();
      (tab ?? window).location.assign(data.url);
    } catch (err) {
      tab?.close();
      toast.error(extractErrorMessage(err, 'No se pudo abrir el documento.'));
    } finally {
      setAbriendo(null);
    }
  };

  return (
    <section className='product-detail-block'>
      <div className='box-head'>
        <h3>
          <FileText size={18} className='me-2' />
          Documentos
        </h3>
      </div>
      <ul className='product-documents'>
        {documents.map((document) => (
          <li key={document.id}>
            <button
              type='button'
              disabled={abriendo === document.id}
              onClick={() => abrir(document.id)}
            >
              <FileText size={18} />
              <span>
                <strong>{DOCUMENT_LABEL[document.type]}</strong>
                {document.filename && (
                  <small className='font-light'>{document.filename}</small>
                )}
              </span>
              <ExternalLink size={15} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductDocumentsSection;
