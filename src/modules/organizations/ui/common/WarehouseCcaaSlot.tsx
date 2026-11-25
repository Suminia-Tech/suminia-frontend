'use client';

import { useRef, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';

import { DOCUMENT_ACCEPT } from '../../hooks/useDocumentFlow';
import {
  useOrganizationDocuments,
  useReviewOrganizationDocument,
} from '../../hooks/useOrganizationDocuments';
import { WAREHOUSE_CCAA_OPTION, type LegalDocumentOption } from '../../lib/commercialProfile';
import { documentSlot } from '../../lib/documentStatus';
import type { OrganizationDocument } from '../../model/organization.types';
import LegalDocumentSlot from './LegalDocumentSlot';

interface WarehouseCcaaSlotProps {
  organizationId: string;
  /* Sin el, la bodega aun no se ha guardado: el hueco se ve, pero no se puede
     subir hasta guardarla, porque el CCAA se asocia a una bodega que exista. */
  warehouseId?: string;
  documents: OrganizationDocument[];
  /* El proveedor lo sube; el personal de Suminia lo abre y lo revisa. */
  editable: boolean;
  reviewable?: boolean;
  /* El titulo, cuando se lista fuera de su bodega: "CCAA · Bodega Itagüí". */
  label?: string;
}

/* El CCAA de una bodega. El INVIMA lo expide por establecimiento, de modo que
   va dentro de cada bodega y no una sola vez en la empresa. Es el mismo
   documento que los demas —versiones, revision, vencimiento—, asociado a la
   bodega. No se exige: quien no almacena dispositivos no lo tiene. */
const WarehouseCcaaSlot = ({
  organizationId,
  warehouseId,
  documents,
  editable,
  reviewable = false,
  label,
}: WarehouseCcaaSlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, open, opening, error, clearError } = useOrganizationDocuments(
    'supplier',
    organizationId,
    warehouseId,
  );
  const revision = useReviewOrganizationDocument('supplier', organizationId);
  const option: LegalDocumentOption = label
    ? { ...WAREHOUSE_CCAA_OPTION, label }
    : WAREHOUSE_CCAA_OPTION;

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (await upload('CCAA', file)) toast.success('CCAA cargado');
  };

  return (
    <>
      <LegalDocumentSlot
        option={option}
        slot={documentSlot(warehouseId ? documents : [], 'CCAA', warehouseId ?? null)}
        editable={editable}
        reviewable={reviewable}
        uploading={uploading === 'CCAA'}
        uploadDisabled={uploading !== null || !warehouseId}
        opening={opening}
        reviewing={revision.reviewing !== null}
        onUpload={() => {
          clearError();
          inputRef.current?.click();
        }}
        onOpen={open}
        onReview={async (documentId, data) => {
          const ok = await revision.review(documentId, data);
          if (ok) {
            toast.success(data.decision === 'APPROVE' ? 'CCAA aprobado' : 'CCAA rechazado');
          }
          return ok;
        }}
      />
      {(error || revision.error) && (
        <small className='text-danger d-block mt-1'>{error ?? revision.error}</small>
      )}
      {editable && (
        <input
          ref={inputRef}
          type='file'
          accept={DOCUMENT_ACCEPT}
          className='d-none'
          onChange={handleFile}
        />
      )}
    </>
  );
};

export default WarehouseCcaaSlot;
