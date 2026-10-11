'use client';

import { ExternalLink, FileText } from 'react-feather';
import { toast } from 'react-toastify';
import { useState } from 'react';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useGetPublicDocumentUrlMutation } from '../../api/productsApi';
import { DOCUMENT_LABEL } from '../../lib/productTypes';
import type { ProductDocument, ProductDocumentType } from '../../model/product.types';

/* Los que cualquiera puede abrir desde la ficha. El CCAA no: es de la
   operacion del proveedor. La misma lista que PUBLIC_DOCUMENT_TYPES del
   backend. */
const PUBLIC_DOCUMENTS: ProductDocumentType[] = ['SANITARY_REGISTRATION', 'TECHNICAL_SHEET'];

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

  /* Los dos que se publican, cargados o no. Un hueco vacio dice que el
     proveedor no lo ha subido; esconder la seccion hacia pensar que la ficha
     no los ofrece, que es justo lo contrario de lo que se quiere contar. */
  const huecos = PUBLIC_DOCUMENTS.map((type) => ({
    type,
    document: documents.find((item) => item.type === type) ?? null,
  }));

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
        {huecos.map(({ type, document }) => (
          <li key={type}>
            {document ? (
              <button
                type='button'
                disabled={abriendo === document.id}
                onClick={() => abrir(document.id)}
              >
                <FileText size={18} />
                <span>
                  <strong>{DOCUMENT_LABEL[type]}</strong>
                  <small className='font-light'>{document.filename ?? 'Ver documento'}</small>
                </span>
                <ExternalLink size={15} />
              </button>
            ) : (
              <div className='is-missing'>
                <FileText size={18} />
                <span>
                  <strong>{DOCUMENT_LABEL[type]}</strong>
                  <small className='font-light'>El proveedor todavía no lo ha cargado.</small>
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductDocumentsSection;
