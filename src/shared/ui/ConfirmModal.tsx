'use client';

import type { ReactNode } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

/* Confirmacion para acciones que no se pueden deshacer.

   Sigue la estructura de los modales del tema (delete-account-modal): la
   cabecera va vacia porque el boton de cierre se posiciona fuera del marco, el
   contenido va centrado en el cuerpo y las acciones en el pie.

   El boton de confirmar queda a la derecha y el de cancelar primero, de modo
   que el gesto por inercia —darle al de la izquierda, o al Escape— sea el que
   no destruye nada. */

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  /** Que se va a perder exactamente. Concreto, no "esta accion es irreversible". */
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  isLoading = false,
}: ConfirmModalProps) => (
  <Modal className='delete-account-modal' centered isOpen={isOpen} toggle={onClose}>
    <ModalHeader toggle={onClose}></ModalHeader>

    <ModalBody className='text-center pb-2'>
      <h4 className='mb-2'>{title}</h4>
      <div className='font-light'>{children}</div>
    </ModalBody>

    <ModalFooter className='d-block text-center pt-0 pb-4 border-0'>
      <button
        type='button'
        className='btn btn-outline-secondary rounded-1 me-2'
        onClick={onClose}
        disabled={isLoading}
      >
        {cancelLabel}
      </button>
      <button
        type='button'
        className='btn btn-danger rounded-1'
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? 'Eliminando...' : confirmLabel}
      </button>
    </ModalFooter>
  </Modal>
);

export default ConfirmModal;
