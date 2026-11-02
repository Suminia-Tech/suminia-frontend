'use client';

import { CheckCircle, ExternalLink, FileText } from 'react-feather';
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
   lo primero que pide un comprador del sector antes de comprar.

   Se pintan con `document-slot`, el mismo hueco de los documentos legales de
   Mi empresa: un documento se ve igual en toda la aplicacion.

   Se abren con un enlace firmado que caduca a los cinco minutos. La pestaña se
   abre dentro del mismo clic y despues se le pone la direccion: abrirla al
   volver la respuesta ya no cuenta como gesto del usuario, y el navegador la
   bloquea como ventana emergente. */
export const ProductDocumentsSection = ({ productId, documents }: ProductDocumentsSectionProps) => {
  const [getUrl] = useGetPublicDocumentUrlMutation();
  const [abriendo, setAbriendo] = useState<string | null>(null);

  /* Los dos que se publican, cargados o no. Un producto sin ellos no se le
     muestra al comprador; el hueco vacio queda para el proveedor y el personal
     de Suminia, que si ven la ficha. */
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
      <div className='document-slots'>
        {huecos.map(({ type, document }) => (
          <div className={`document-slot${document ? ' is-filled' : ''}`} key={type}>
            <span className='document-slot-icon'>
              {document ? <CheckCircle size={20} /> : <FileText size={20} />}
            </span>
            <div className='document-slot-text'>
              <strong>{DOCUMENT_LABEL[type]}</strong>
              <small className='font-light'>
                {document ? (document.filename ?? 'Documento cargado') : 'Sin cargar.'}
              </small>
            </div>
            {document && (
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm btn-with-icon'
                disabled={abriendo === document.id}
                onClick={() => abrir(document.id)}
              >
                <ExternalLink size={14} /> Ver
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductDocumentsSection;
