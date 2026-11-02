'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, Upload } from 'react-feather';

import { formatDate, formatDay, todayInColombia } from '@/shared/lib/dates';

import type { LegalDocumentOption } from '../../lib/commercialProfile';
import {
  DOCUMENT_STATE_META,
  versionStatusLabel,
  type DocumentSlot,
} from '../../lib/documentStatus';
import type { ReviewDocumentRequest } from '../../model/supplier.types';

/* Lo que se dice bajo el nombre: que pasa con el documento y, si toca, que
   hacer. Quien no puede subir no necesita la instruccion. */
const describeSlot = (slot: DocumentSlot, option: LegalDocumentOption, editable: boolean) => {
  const { latest, current } = slot;
  /* La anterior solo "sigue vigente" si no vencio: una vencida no respalda
     nada mientras se revisa la nueva. */
  const vigente = current !== null && current.status !== 'EXPIRED';
  switch (slot.state) {
    case 'MISSING':
      return editable ? option.help : 'Sin cargar.';
    case 'IN_REVIEW':
      return vigente
        ? `Se cargó una nueva versión el ${formatDate(latest?.uploadedAt)}. La anterior se conserva mientras se verifica el cambio.`
        : current
          ? `Se cargó una nueva versión el ${formatDate(latest?.uploadedAt)} para reemplazar la vencida. Suminia la está revisando.`
          : `Cargado el ${formatDate(latest?.uploadedAt)}. Suminia lo está revisando.`;
    case 'APPROVED':
      return [
        'Documento verificado',
        `Actualizado el ${formatDate(latest?.uploadedAt)}`,
        latest?.expiresAt && `Vence el ${formatDay(latest.expiresAt)}`,
      ]
        .filter(Boolean)
        .join(' · ');
    case 'REJECTED':
      return [
        latest?.rejectionReason ? `Motivo: ${latest.rejectionReason}` : 'No fue aprobado.',
        vigente
          ? 'La versión aprobada anterior sigue vigente.'
          : editable
            ? 'Sube una versión corregida.'
            : null,
      ]
        .filter(Boolean)
        .join(' ');
    case 'EXPIRED':
      return `Venció el ${formatDay(latest?.expiresAt)}.${editable ? ' Sube uno actualizado.' : ''}`;
  }
};

interface LegalDocumentSlotProps {
  option: LegalDocumentOption;
  slot: DocumentSlot;
  /* La empresa sube; el personal de Suminia revisa. */
  editable: boolean;
  reviewable: boolean;
  uploading: boolean;
  uploadDisabled: boolean;
  opening: string | null;
  reviewing: boolean;
  onUpload: () => void;
  onOpen: (documentId: string) => void;
  onReview: (documentId: string, data: ReviewDocumentRequest) => Promise<boolean>;
}

/* Un documento con su estado, su historial y, para el personal de Suminia, la
   revision de la version que espera. */
const LegalDocumentSlot = ({
  option,
  slot,
  editable,
  reviewable,
  uploading,
  uploadDisabled,
  opening,
  reviewing,
  onUpload,
  onOpen,
  onReview,
}: LegalDocumentSlotProps) => {
  const [showHistory, setShowHistory] = useState(false);
  /* Rechazar pide el motivo y aprobar ofrece la fecha de vencimiento: ninguno
     de los dos se decide con un solo clic. */
  const [mode, setMode] = useState<'idle' | 'approve' | 'reject'>('idle');
  const [reason, setReason] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const { state, latest } = slot;
  const meta = DOCUMENT_STATE_META[state];
  const pending = reviewable && state === 'IN_REVIEW' && latest;
  /* Lo que la empresa tiene que resolver se marca en el borde, como antes lo
     que faltaba. */
  const highlight = editable && (state === 'MISSING' || state === 'REJECTED' || state === 'EXPIRED');

  const submit = async (decision: ReviewDocumentRequest['decision']) => {
    if (!latest) return;
    const ok = await onReview(
      latest.id,
      decision === 'APPROVE'
        ? { decision, expiresAt: expiresAt || null }
        : { decision, reason: reason.trim() },
    );
    if (ok) {
      setMode('idle');
      setReason('');
      setExpiresAt('');
    }
  };

  return (
    <div
      className={`document-slot is-versioned is-${state.toLowerCase().replace('_', '-')}${highlight ? ' is-missing' : ''}`}
    >
      <div className='document-slot-row'>
        <div className='document-slot-text'>
          <div className='document-slot-title'>
            <strong>
              {option.label}
              {editable && state === 'MISSING' && option.required && (
                <span className='document-required'> · obligatorio</span>
              )}
            </strong>
            <span className={`document-state is-${meta.tone}`}>{meta.label}</span>
          </div>
          <small className='font-light'>{describeSlot(slot, option, editable)}</small>
        </div>
        <div className='document-slot-actions'>
          {latest && (
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm btn-with-icon'
              disabled={opening === latest.id}
              onClick={() => onOpen(latest.id)}
            >
              <ExternalLink size={14} /> Ver
            </button>
          )}
          {editable && (
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm btn-with-icon'
              disabled={uploadDisabled}
              onClick={onUpload}
            >
              <Upload size={14} />
              {uploading ? 'Subiendo...' : state === 'MISSING' ? 'Subir documento' : 'Reemplazar'}
            </button>
          )}
        </div>
      </div>

      {pending && (
        <div className='document-review'>
          {mode === 'idle' && (
            <div className='document-review-actions'>
              <button
                type='button'
                className='btn btn-primary btn-sm'
                onClick={() => setMode('approve')}
              >
                Aprobar
              </button>
              <button
                type='button'
                className='btn btn-outline-danger btn-sm'
                onClick={() => setMode('reject')}
              >
                Rechazar
              </button>
            </div>
          )}

          {mode === 'approve' && (
            <>
              <label className='form-label' htmlFor={`vence-${latest.id}`}>
                Vence el (opcional)
              </label>
              <input
                id={`vence-${latest.id}`}
                type='date'
                className='form-control'
                min={todayInColombia()}
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
              />
              <small className='font-light'>
                Déjalo vacío si el documento no vence. Pasada la fecha se mostrará como vencido.
              </small>
              <div className='document-review-actions'>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  disabled={reviewing}
                  onClick={() => submit('APPROVE')}
                >
                  {reviewing ? 'Guardando...' : 'Confirmar aprobación'}
                </button>
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm'
                  disabled={reviewing}
                  onClick={() => setMode('idle')}
                >
                  Cancelar
                </button>
              </div>
            </>
          )}

          {mode === 'reject' && (
            <>
              <label className='form-label' htmlFor={`motivo-${latest.id}`}>
                Qué debe corregir la empresa
              </label>
              <textarea
                id={`motivo-${latest.id}`}
                className='form-control'
                rows={3}
                maxLength={500}
                placeholder='El certificado tiene más de 30 días de expedido.'
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
              <div className='document-review-actions'>
                <button
                  type='button'
                  className='btn btn-outline-danger btn-sm'
                  disabled={reviewing || !reason.trim()}
                  onClick={() => submit('REJECT')}
                >
                  {reviewing ? 'Guardando...' : 'Rechazar documento'}
                </button>
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm'
                  disabled={reviewing}
                  onClick={() => setMode('idle')}
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* El historial solo si hay mas de una version: con una sola, lo que
          diria ya esta escrito arriba. */}
      {slot.history.length > 1 && (
        <>
          <button
            type='button'
            className='document-history-toggle'
            aria-expanded={showHistory}
            onClick={() => setShowHistory((current) => !current)}
          >
            <ChevronDown size={14} />
            Historial de versiones ({slot.history.length})
          </button>
          {showHistory && (
            <div className='document-history'>
              {slot.history.map((version) => (
                <div className='document-history-item' key={version.id}>
                  <div>
                    <strong>{version.filename ?? 'Documento'}</strong>
                    <span className='font-light'> · {versionStatusLabel(version)}</span>
                    <small className='font-light'>
                      {[
                        `Subido el ${formatDate(version.uploadedAt)}${version.uploadedBy ? ` por ${version.uploadedBy.name}` : ''}`,
                        version.reviewedAt &&
                          `revisado el ${formatDate(version.reviewedAt)}${version.reviewedBy ? ` por ${version.reviewedBy.name}` : ''}`,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                      {version.rejectionReason && `. Motivo: ${version.rejectionReason}`}
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
      )}
    </div>
  );
};

export default LegalDocumentSlot;
