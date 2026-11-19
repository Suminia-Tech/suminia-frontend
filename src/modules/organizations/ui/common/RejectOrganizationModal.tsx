'use client';

import { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { MIN_REASON_LENGTH } from '../../model/organization.types';

/* Rechazar desde el listado, sin abrir la ficha: el mismo motivo obligatorio
   que en la ficha, en el modal de confirmacion del tema. El motivo le llega a
   la empresa en el correo y queda en el historial de decisiones. */
interface RejectOrganizationModalProps {
  /** El nombre de la empresa; nulo cierra el modal. */
  organizationName: string | null;
  noun: string;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const RejectOrganizationModal = ({
  organizationName,
  noun,
  isLoading,
  error,
  onClose,
  onConfirm,
}: RejectOrganizationModalProps) => {
  const [motivo, setMotivo] = useState('');
  const valido = motivo.trim().length >= MIN_REASON_LENGTH;
  const cerrar = () => {
    setMotivo('');
    onClose();
  };

  return (
    <Modal
      className='delete-account-modal'
      centered
      isOpen={organizationName !== null}
      toggle={cerrar}
    >
      <ModalHeader toggle={cerrar}></ModalHeader>

      <ModalBody className='pb-2'>
        <h4 className='mb-2 text-center'>Rechazar a {organizationName}</h4>
        <div className='status-reason text-start'>
          <label className='form-label' htmlFor='motivo-rechazo-lista'>
            Motivo del rechazo
          </label>
          <textarea
            id='motivo-rechazo-lista'
            className='form-control'
            rows={4}
            maxLength={1000}
            autoFocus
            placeholder='El RUT no coincide con la razón social registrada.'
            value={motivo}
            onChange={(event) => setMotivo(event.target.value)}
          />
          <p className='font-light status-reason-note'>
            Le llega al {noun} en el correo que le avisa la decisión, para que sepa qué corregir.
            También queda en el historial, con tu nombre y la fecha.
          </p>
          {error && <div className='alert alert-danger mb-0'>{error}</div>}
        </div>
      </ModalBody>

      <ModalFooter className='d-block text-center pt-0 pb-4 border-0'>
        <button
          type='button'
          className='btn btn-outline-secondary me-2'
          onClick={cerrar}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type='button'
          className='btn btn-danger'
          onClick={() => onConfirm(motivo)}
          disabled={isLoading || !valido}
        >
          {isLoading ? 'Rechazando...' : 'Rechazar'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default RejectOrganizationModal;
