'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { CheckCircle, ExternalLink, FileText, Trash2, Upload } from 'react-feather';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDateTime } from '@/shared/lib/dates';
import { ConfirmModal } from '@/shared/ui';

import { useRemoveDocumentMutation } from '../../api/productsApi';
import { DOCUMENT_ACCEPT, useDocumentUpload } from '../../hooks/useDocumentUpload';
import { useOpenDocument } from '../../hooks/useOpenDocument';
import {
  DOCUMENT_HELP,
  DOCUMENT_LABEL,
  OFFERED_DOCUMENTS,
  requiredDocuments,
} from '../../lib/productTypes';
import type { Product, ProductDocumentType } from '../../model/product.types';
import { DocumentHistory } from '../common/DocumentHistory';

interface ProductDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

/* Los documentos tecnicos y sanitarios que direccion tecnica revisa antes de
   publicar el producto. Un hueco por tipo: subir otro del mismo tipo reemplaza
   al anterior, de modo que nunca hay dos registros sanitarios que comparar. El
   anterior no se borra: queda como version anterior, con su fecha.

   El registro sanitario y la ficha tecnica se ofrecen siempre. El CCAA ya no:
   es de la empresa y se sube en Mi empresa; un CCAA que un producto ya tenia
   sigue apareciendo mientras exista, para poder quitarlo. */
const ProductDocumentsModal = ({ isOpen, onClose, product }: ProductDocumentsModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<ProductDocumentType | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const { upload, uploading, error, clearError } = useDocumentUpload(product.id);
  const { open, opening } = useOpenDocument(product.id);
  const [removeDocument, { isLoading: isRemoving }] = useRemoveDocumentMutation();

  const required = requiredDocuments(
    product.type,
    product.sanitaryRegistration,
  );
  const slots = [
    ...new Set<ProductDocumentType>([
      ...OFFERED_DOCUMENTS,
      ...required,
      ...product.documents.map((document) => document.type),
    ]),
  ];

  /* A un producto publicado o en revision no se le quita un soporte exigido:
     el backend lo rechaza. Se reemplaza subiendo otro. */
  const locked = product.status === 'ACTIVE' || product.status === 'PENDING_REVIEW';

  const pick = (type: ProductDocumentType) => {
    setTarget(type);
    clearError();
    inputRef.current?.click();
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    /* Se vacia para que elegir el mismo archivo otra vez vuelva a disparar el
       cambio. */
    event.target.value = '';
    if (!file || !target) return;

    if (await upload(target, file)) {
      toast.success(`${DOCUMENT_LABEL[target]} cargado`);
    }
  };

  const confirmRemove = async () => {
    if (!pendingDelete) return;

    try {
      await removeDocument({ productId: product.id, documentId: pendingDelete }).unwrap();
      toast.success('Documento retirado');
      setPendingDelete(null);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo retirar el documento.'));
    }
  };

  return (
    <Modal className='add-address-modal' centered isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}></ModalHeader>

      <ModalBody>
        <div className='box-head'>
          <h3>Documentos técnicos y sanitarios</h3>
        </div>
        <p className='font-light'>
          {product.name}. Adjunta los documentos técnicos y sanitarios aplicables al
          producto. Nuestro equipo los revisará antes de aprobar su publicación. Los
          documentos deben estar completos, legibles y vigentes cuando corresponda. PDF,
          JPG o PNG.
        </p>

        {product.status === 'ACTIVE' && (
          <div className='alert alert-warning'>
            Si modificas un documento técnico o sanitario del producto, su publicación se
            suspenderá temporalmente. Volverá a estar disponible para compras una vez
            Suminia apruebe la actualización.
          </div>
        )}

        {slots.length === 0 ? (
          <p className='font-light mb-0'>Este producto no requiere documentos.</p>
        ) : (
          <div className='document-slots'>
            {slots.map((type) => {
              const document = product.documents.find((item) => item.type === type);
              const isRequired = required.includes(type);

              return (
                <div
                  className={`document-slot is-versioned${document ? ' is-filled' : ''}`}
                  key={type}
                >
                  <div className='document-slot-row'>
                  <span className='document-slot-icon'>
                    {document ? <CheckCircle size={18} /> : <FileText size={18} />}
                  </span>

                  <div className='document-slot-text'>
                    {/* Sin "Obligatorio" ni "Opcional": no todo producto tiene
                        registro sanitario, y la etiqueta confundia mas de lo
                        que aclaraba. Lo que falte para enviar a revision lo
                        dice el envio. */}
                    <div className='document-slot-title'>
                      <strong>{DOCUMENT_LABEL[type]}</strong>
                    </div>
                    <small className='font-light'>
                      {document
                        ? `${document.filename ?? 'Documento cargado'} · subido el ${formatDateTime(document.createdAt)}`
                        : DOCUMENT_HELP[type]}
                    </small>
                  </div>

                  <div className='row-actions'>
                    {document && (
                      <button
                        type='button'
                        title='Ver documento'
                        aria-label='Ver documento'
                        disabled={opening === document.id}
                        onClick={() => open(document.id)}
                      >
                        <ExternalLink size={15} />
                      </button>
                    )}
                    <button
                      type='button'
                      title={document ? 'Reemplazar' : 'Subir'}
                      aria-label={document ? 'Reemplazar' : 'Subir'}
                      disabled={uploading !== null}
                      onClick={() => pick(type)}
                    >
                      <Upload size={15} />
                      <span>
                        {uploading === type ? 'Subiendo...' : document ? 'Reemplazar' : 'Subir'}
                      </span>
                    </button>
                    {document && !(locked && isRequired) && (
                      <button
                        type='button'
                        className='is-danger'
                        title='Retirar documento'
                        aria-label='Retirar documento'
                        onClick={() => setPendingDelete(document.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  </div>
                  <DocumentHistory
                    product={product}
                    type={type}
                    opening={opening}
                    onOpen={open}
                  />
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div className='alert alert-danger mt-3' onClick={clearError} role='presentation'>
            {error}
          </div>
        )}

        <input
          ref={inputRef}
          type='file'
          accept={DOCUMENT_ACCEPT}
          className='d-none'
          onChange={handleFile}
        />
      </ModalBody>

      {pendingDelete && (
        <ConfirmModal
          isOpen={Boolean(pendingDelete)}
          onClose={() => setPendingDelete(null)}
          onConfirm={confirmRemove}
          isLoading={isRemoving}
          title='¿Retirar este documento?'
          confirmLabel='Sí, retirar'
        >
          <p className='mb-0'>
            Deja de estar vigente, pero Suminia lo conserva como versión anterior, con
            su fecha.
          </p>
        </ConfirmModal>
      )}

      <ModalFooter className='pt-0 text-end d-block'>
        <button type='button' className='btn btn-outline-secondary' onClick={onClose}>
          Cerrar
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ProductDocumentsModal;
