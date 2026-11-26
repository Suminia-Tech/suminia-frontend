'use client';

import { CheckCircle, ExternalLink, FileText } from 'react-feather';
import { toast } from 'react-toastify';
import { useState } from 'react';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useGetPublicDocumentUrlMutation } from '../../api/productsApi';
import { DOCUMENT_LABEL, studyTypeLabel } from '../../lib/productTypes';
import type { ProductDocument, ProductDocumentType } from '../../model/product.types';

/* Los que se muestran siempre, cargados o no. La ficha de datos de seguridad
   solo si esta, porque no aplica a todo producto, y los estudios en su
   propia lista. Todos estan en PUBLIC_DOCUMENT_TYPES del backend. */
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
  const fds = documents.find((item) => item.type === 'SAFETY_DATA_SHEET') ?? null;
  const huecos = [
    ...PUBLIC_DOCUMENTS.map((type) => ({
      key: type,
      title: DOCUMENT_LABEL[type],
      detail: null as string | null,
      document: documents.find((item) => item.type === type) ?? null,
    })),
    ...(fds
      ? [{ key: fds.id, title: DOCUMENT_LABEL.SAFETY_DATA_SHEET, detail: null, document: fds }]
      : []),
    ...documents
      .filter((item) => item.type === 'STUDY')
      .map((study) => ({
        key: study.id,
        title: study.title ?? 'Estudio',
        detail: studyTypeLabel(study.studyType),
        document: study,
      })),
  ];

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
        {huecos.map(({ key, title, detail, document }) => (
          <div className={`document-slot${document ? ' is-filled' : ''}`} key={key}>
            <span className='document-slot-icon'>
              {document ? <CheckCircle size={20} /> : <FileText size={20} />}
            </span>
            <div className='document-slot-text'>
              <strong>{title}</strong>
              <small className='font-light'>
                {[detail, document ? (document.filename ?? 'Documento cargado') : 'Sin cargar.']
                  .filter(Boolean)
                  .join(' · ')}
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
