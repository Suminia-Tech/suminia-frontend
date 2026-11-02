'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';

import { Panel } from '@/shared/ui';

import { DOCUMENT_ACCEPT } from '../../hooks/useDocumentFlow';
import type { OrganizationKind } from '../../hooks/useOrganizationAdmin';
import {
  useOrganizationDocuments,
  useReviewOrganizationDocument,
} from '../../hooks/useOrganizationDocuments';
import { legalDocumentOptions } from '../../lib/commercialProfile';
import { documentSlot } from '../../lib/documentStatus';
import type {
  LegalNature,
  OrganizationDocument,
  OrganizationDocumentType,
} from '../../model/organization.types';
import LegalDocumentSlot from './LegalDocumentSlot';

interface LegalDocumentsPanelProps {
  /* Para llegar al panel desde el Resumen, y el aviso de lo que falta. */
  id?: string;
  warning?: string;
  kind: OrganizationKind;
  organizationId: string;
  documents: OrganizationDocument[];
  /* La empresa sube y reemplaza; el personal de Suminia los abre y revisa. */
  editable: boolean;
  reviewable?: boolean;
  /* Del comprador: una persona natural no sube camara de comercio ni
     composicion accionaria. */
  legalNature?: LegalNature | null;
}

/* Los soportes con los que Suminia verifica a la empresa. Un hueco por tipo,
   con el estado de su ultima version y el historial de las anteriores: subir
   otro no borra el que habia, y el aprobado sigue valiendo mientras se revisa
   el nuevo.

   Se suben en el momento y no con el boton de guardar del formulario: un
   archivo ya esta en el almacenamiento cuando termina de subir, y esperar a
   "Guardar cambios" para registrarlo dejaria objetos sueltos cada vez que
   alguien sale de la pagina sin guardar. */
const LegalDocumentsPanel = ({
  id,
  warning,
  kind,
  organizationId,
  documents,
  editable,
  reviewable = false,
  legalNature,
}: LegalDocumentsPanelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<OrganizationDocumentType | null>(null);
  const { upload, uploading, open, opening, error, clearError } = useOrganizationDocuments(
    kind,
    organizationId,
  );
  const revision = useReviewOrganizationDocument(kind, organizationId);
  const opciones = legalDocumentOptions(kind, legalNature);

  const pick = (type: OrganizationDocumentType) => {
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
      const label = opciones.find((option) => option.value === target)?.label;
      toast.success(`${label ?? 'Documento'} cargado`);
    }
  };

  return (
    <Panel
      id={id}
      warning={warning}
      title='Documentos legales'
      description={
        editable
          ? kind === 'buyer'
            ? 'Con estos soportes Suminia verifica tu empresa. Los marcados como obligatorios son necesarios para aprobarla. PDF, JPG o PNG.'
            : 'Con estos soportes Suminia verifica tu empresa. PDF, JPG o PNG.'
          : reviewable
            ? 'Los soportes que subió la empresa. Aprueba o rechaza cada versión que espera revisión.'
            : 'Los soportes que subió la empresa para su verificación.'
      }
    >
      <div className='document-slots'>
        {opciones.map((option) => (
          <LegalDocumentSlot
            key={option.value}
            option={option}
            slot={documentSlot(documents, option.value)}
            editable={editable}
            reviewable={reviewable}
            uploading={uploading === option.value}
            uploadDisabled={uploading !== null}
            opening={opening}
            reviewing={revision.reviewing !== null}
            onUpload={() => pick(option.value)}
            onOpen={open}
            onReview={async (documentId, data) => {
              const ok = await revision.review(documentId, data);
              if (ok) {
                toast.success(
                  data.decision === 'APPROVE'
                    ? `${option.label}: aprobado`
                    : `${option.label}: rechazado`,
                );
              }
              return ok;
            }}
          />
        ))}
      </div>

      {revision.error && (
        <div className='alert alert-danger mt-3' onClick={revision.clearError} role='presentation'>
          {revision.error}
        </div>
      )}

      {error && (
        <div className='alert alert-danger mt-3' onClick={clearError} role='presentation'>
          {error}
        </div>
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
    </Panel>
  );
};

export default LegalDocumentsPanel;
