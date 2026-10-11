'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { CheckCircle, ExternalLink, FileText, Upload } from 'react-feather';
import { toast } from 'react-toastify';

import { formatDate } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { DOCUMENT_ACCEPT } from '../../hooks/useDocumentFlow';
import type { OrganizationKind } from '../../hooks/useOrganizationAdmin';
import { useOrganizationDocuments } from '../../hooks/useOrganizationDocuments';
import { legalDocumentOptions } from '../../lib/commercialProfile';
import type {
  LegalNature,
  OrganizationDocument,
  OrganizationDocumentType,
} from '../../model/organization.types';

interface LegalDocumentsPanelProps {
  /* Para llegar al panel desde el Resumen, y el aviso de lo que falta. */
  id?: string;
  warning?: string;
  kind: OrganizationKind;
  organizationId: string;
  documents: OrganizationDocument[];
  /* La empresa sube y reemplaza; el personal de Suminia solo los abre. */
  editable: boolean;
  /* Del comprador: una persona natural no sube camara de comercio ni
     composicion accionaria. */
  legalNature?: LegalNature | null;
}

/* Los soportes con los que Suminia verifica a la empresa. Un hueco por tipo, y
   subir otro reemplaza al anterior: nunca hay dos RUT que comparar.

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
  legalNature,
}: LegalDocumentsPanelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<OrganizationDocumentType | null>(null);
  const { upload, uploading, open, opening, error, clearError } = useOrganizationDocuments(
    kind,
    organizationId,
  );
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
          : 'Los soportes que subió la empresa para su verificación.'
      }
    >
      <div className='document-slots'>
        {opciones.map((option) => {
          const document = documents.find((item) => item.type === option.value);

          /* Al personal interno no le sirve un hueco vacio con un boton que no
             puede pulsar: le basta con saber que falta. */
          return (
            <div
              className={`document-slot${document ? ' is-filled' : editable ? ' is-missing' : ''}`}
              key={option.value}
            >
              <span className='document-slot-icon'>
                {document ? <CheckCircle size={18} /> : <FileText size={18} />}
              </span>
              <div className='document-slot-text'>
                <strong>
                  {option.label}
                  {/* Lo que falta se marca en el hueco: "obligatorio" si sin el
                      no se aprueba la empresa, "falta" si solo esta pendiente.
                      Solo para quien lo puede subir. */}
                  {editable && !document && (
                    <span className='document-required'>
                      {option.required ? ' · obligatorio' : ' · falta'}
                    </span>
                  )}
                </strong>
                <small className='font-light'>
                  {document
                    ? `${document.filename ?? 'Documento cargado'} · ${formatDate(document.uploadedAt)}`
                    : editable
                      ? option.help
                      : 'Sin cargar'}
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
                {editable && (
                  <button
                    type='button'
                    title={document ? 'Reemplazar' : 'Subir'}
                    aria-label={document ? 'Reemplazar' : 'Subir'}
                    disabled={uploading !== null}
                    onClick={() => pick(option.value)}
                  >
                    <Upload size={15} />
                    <span>
                      {uploading === option.value
                        ? 'Subiendo...'
                        : document
                          ? 'Reemplazar'
                          : 'Subir'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
