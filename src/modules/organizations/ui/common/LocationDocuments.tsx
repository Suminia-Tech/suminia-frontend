'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { CheckCircle, ExternalLink, FileText, Upload } from 'react-feather';
import { toast } from 'react-toastify';

import { DOCUMENT_ACCEPT } from '../../hooks/useDocumentFlow';
import { useLocationDocuments } from '../../hooks/useOrganizationDocuments';
import type {
  LocationDocument,
  LocationDocumentType,
} from '../../model/deliveryLocation.types';

/* Los soportes de una sede: que esta habilitada para recibir lo que se le
   manda y que la direccion es de la empresa. Un hueco por tipo, y subir otro
   reemplaza al anterior. */
const OPCIONES: { value: LocationDocumentType; label: string; help: string }[] = [
  {
    value: 'OPERATING_PERMIT',
    label: 'Habilitación del servicio',
    help: 'Farmacéutico, de laboratorio u otro, según lo que recibe esta sede.',
  },
  {
    value: 'ADDRESS_CERTIFICATE',
    label: 'Certificado de existencia y representación legal',
    help: 'Que detalle la dirección de esta sede.',
  },
];

interface LocationDocumentsProps {
  locationId: string;
  documents: LocationDocument[];
  /* Subir es de quien administra la empresa; los demas solo los abren. */
  editable: boolean;
}

export const LocationDocuments = ({ locationId, documents, editable }: LocationDocumentsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<LocationDocumentType | null>(null);
  const { upload, uploading, open, opening, error, clearError } =
    useLocationDocuments(locationId);

  const pick = (type: LocationDocumentType) => {
    setTarget(type);
    clearError();
    inputRef.current?.click();
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !target) return;

    if (await upload(target, file)) {
      toast.success(`${OPCIONES.find((o) => o.value === target)?.label ?? 'Documento'} cargado`);
    }
  };

  return (
    <div className='location-documents'>
      <div className='document-slots'>
        {OPCIONES.map((option) => {
          const document = documents.find((item) => item.type === option.value);
          return (
            <div
              className={`document-slot${document ? ' is-filled' : ''}`}
              key={option.value}
            >
              <span className='document-slot-icon'>
                {document ? <CheckCircle size={18} /> : <FileText size={18} />}
              </span>
              <div className='document-slot-text'>
                <strong>{option.label}</strong>
                <small className='font-light'>
                  {document ? (document.filename ?? 'Documento cargado') : option.help}
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
        <div className='alert alert-danger mt-2 mb-0' onClick={clearError} role='presentation'>
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
    </div>
  );
};

export default LocationDocuments;
