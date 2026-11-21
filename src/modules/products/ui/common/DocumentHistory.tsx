'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink } from 'react-feather';

import { formatDateTime } from '@/shared/lib/dates';

import type { Product, ProductDocumentType } from '../../model/product.types';

/* Las versiones anteriores de un documento, bajo su hueco: lo que estuvo
   cargado, cuando se subio y cuando dejo de valer. Nada se borra —es el
   respaldo ante el INVIMA o un reclamo—, y cada version se puede abrir.

   Con la misma pieza que el historial de los documentos de la empresa
   (LegalDocumentSlot): un documento con versiones se ve igual en toda la app.
   Solo lo ven el dueño y el personal de Suminia: el backend no le manda el
   historial a nadie mas. */
export const DocumentHistory = ({
  product,
  type,
  opening,
  onOpen,
}: {
  product: Product;
  type: ProductDocumentType;
  opening: string | null;
  onOpen: (documentId: string) => void;
}) => {
  const [abierto, setAbierto] = useState(false);
  const versiones = (product.documentHistory ?? []).filter((version) => version.type === type);
  if (versiones.length === 0) return null;

  return (
    <>
      <button
        type='button'
        className='document-history-toggle'
        aria-expanded={abierto}
        onClick={() => setAbierto((actual) => !actual)}
      >
        <ChevronDown size={14} />
        Versiones anteriores ({versiones.length})
      </button>
      {abierto && (
        <div className='document-history'>
          {versiones.map((version) => (
            <div className='document-history-item' key={version.id}>
              <div>
                <strong>{version.filename ?? 'Documento'}</strong>
                <small className='font-light'>
                  Subido el {formatDateTime(version.createdAt)}, reemplazado el{' '}
                  {formatDateTime(version.retiredAt)}
                </small>
              </div>
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm'
                aria-label='Ver esta versión'
                title='Ver esta versión'
                disabled={opening === version.id}
                onClick={() => onOpen(version.id)}
              >
                <ExternalLink size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DocumentHistory;
