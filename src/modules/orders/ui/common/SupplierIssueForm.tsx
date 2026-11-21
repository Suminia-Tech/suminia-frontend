'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { Panel } from '@/shared/ui';

import { useChangeOrderStatusMutation } from '../../api/ordersApi';
import { SUPPLIER_ISSUE_LABEL, SUPPLIER_ISSUES } from '../../lib/orderStatus';
import type { Order, SupplierIssue } from '../../model/order.types';
import SupplierAvailabilityForm from './SupplierAvailabilityForm';

/* La novedad del proveedor sobre una orden de compra: por que no puede
   atenderla como se emitio.

   El motivo se elige de una lista fija y no se escribe: es lo que deja a
   Suminia contar por que se caen las ordenes y evaluar a cada proveedor. El
   detalle es opcional, salvo en "otro motivo", que sin el no dice nada.

   Todo en un solo panel, en la columna principal: el motivo arriba y, segun
   el motivo, lo que sigue debajo. La disponibilidad parcial despliega ahi
   mismo las cantidades de cada producto; antes llevaba a un formulario en
   otra parte de la pantalla, y al proveedor le parecia que no habia pasado
   nada. Las demas devuelven la orden a Suminia —anulada si aun no la
   confirmo, cancelada si ya—. La novedad solo la lee Suminia. */

interface SupplierIssueFormProps {
  order: Order;
  /** Antes de confirmar se anula; despues, se cancela. */
  mode: 'reject' | 'cancel';
  onClose: () => void;
}

const SupplierIssueForm = ({ order, mode, onClose }: SupplierIssueFormProps) => {
  const [issue, setIssue] = useState<SupplierIssue | ''>('');
  const [detalle, setDetalle] = useState('');
  const [changeStatus, { isLoading }] = useChangeOrderStatusMutation();
  const panel = useRef<HTMLDivElement>(null);

  /* Se abre desde un boton de la columna lateral: se lleva la vista hasta el
     panel para que se vea que algo se abrio. */
  useEffect(() => {
    panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /* Ya confirmada, la disponibilidad parcial no aplica: se comprometio con
     todo. */
  const opciones = SUPPLIER_ISSUES.filter(
    (opcion) => mode === 'reject' || opcion !== 'PARTIAL_AVAILABILITY',
  );
  const parcial = issue === 'PARTIAL_AVAILABILITY';
  const faltaDetalle = issue === 'OTHER' && !detalle.trim();

  const enviar = async () => {
    if (!issue || parcial) return;
    try {
      await changeStatus({
        id: order.id,
        status: mode === 'reject' ? 'REJECTED' : 'CANCELLED',
        issue,
        reason: detalle.trim() || undefined,
      }).unwrap();
      toast.success('Novedad enviada a Suminia');
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo enviar la novedad.'));
    }
  };

  return (
    <div ref={panel} className='scroll-anchor'>
      <Panel
        title='Reportar novedad'
        description='Indica por qué no puedes atender la orden de compra como fue emitida.'
      >
        <div className='issue-reason'>
          <label className='form-label' htmlFor='novedad-motivo'>
            Motivo
          </label>
          <select
            id='novedad-motivo'
            className='form-control'
            value={issue}
            onChange={(event) => setIssue(event.target.value as SupplierIssue | '')}
          >
            <option value=''>Selecciona el motivo</option>
            {opciones.map((opcion) => (
              <option key={opcion} value={opcion}>
                {SUPPLIER_ISSUE_LABEL[opcion]}
              </option>
            ))}
          </select>
        </div>

        {parcial ? (
          <div className='mt-4'>
            <SupplierAvailabilityForm order={order} onClose={onClose} />
          </div>
        ) : (
          <>
            {issue && (
              <div className='mt-3'>
                <label className='form-label' htmlFor='novedad-detalle'>
                  Detalle{issue === 'OTHER' ? '' : ' (opcional)'}
                </label>
                <textarea
                  id='novedad-detalle'
                  className='form-control'
                  rows={3}
                  maxLength={500}
                  value={detalle}
                  onChange={(event) => setDetalle(event.target.value)}
                />
                <small className='font-light d-block mt-2'>
                  Esta información es visible únicamente para Suminia. Al enviar la
                  novedad, la orden de compra queda{' '}
                  {mode === 'reject' ? 'anulada' : 'cancelada'} y no debe despacharse.
                </small>
              </div>
            )}

            <div className='d-flex gap-2 mt-3'>
              <button
                type='button'
                className='btn btn-outline-danger btn-sm'
                disabled={isLoading || !issue || faltaDetalle}
                onClick={enviar}
              >
                {isLoading ? 'Enviando...' : 'Enviar novedad'}
              </button>
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm'
                disabled={isLoading}
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
};

export default SupplierIssueForm;
