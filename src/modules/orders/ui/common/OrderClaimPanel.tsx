'use client';

import { useState } from 'react';
import { AlertCircle } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate, formatDateTime } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useOpenClaimMutation, useResolveClaimMutation } from '../../api/ordersApi';
import { CLAIM_REASON_LABEL } from '../../lib/orderStatus';
import type { ClaimReason, Order, OrderClaim } from '../../model/order.types';
import type { OrderSide } from './OrdersListScreen';

/* El reclamo del comprador sobre lo que recibio.

   Se abre dentro de los dias de reclamo despues de la entrega. Mientras este
   abierto el pedido no se cierra y no entra en la liquidacion del proveedor:
   no se le paga lo que esta en disputa. Lo resuelve Suminia con lo acordado
   —reposicion, nota credito, sin lugar— y el pedido sigue su curso.

   El panel no aparece si no hay reclamos ni se puede abrir uno. */
export const OrderClaimPanel = ({ order, side }: { order: Order; side: OrderSide }) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const puedeResolver = side === 'staff' && hasPermission(permissions, 'payment:verify');
  const abierto = order.claims.some((claim) => claim.status === 'OPEN');
  const enPlazo =
    order.status === 'DELIVERED' &&
    order.claimableUntil !== null &&
    new Date(order.claimableUntil) > new Date();
  const puedeReclamar = side === 'buyer' && enPlazo && !abierto;

  if (order.claims.length === 0 && !puedeReclamar) return null;

  return (
    <Panel
      title='Reclamos'
      aside={
        abierto && <span className='document-state is-danger'>En reclamo</span>
      }
    >
      {order.claims.length > 0 && (
        <div className='document-slots'>
          {[...order.claims].reverse().map((claim) => (
            <ClaimSlot
              key={claim.id}
              order={order}
              claim={claim}
              resolvable={puedeResolver && claim.status === 'OPEN'}
            />
          ))}
        </div>
      )}

      {puedeReclamar && <ClaimForm order={order} />}
    </Panel>
  );
};

const ClaimSlot = ({
  order,
  claim,
  resolvable,
}: {
  order: Order;
  claim: OrderClaim;
  resolvable: boolean;
}) => {
  const [resolve, { isLoading }] = useResolveClaimMutation();
  const [abierto, setAbierto] = useState(false);
  const [resolution, setResolution] = useState('');

  const resolver = async () => {
    try {
      await resolve({ id: order.id, claimId: claim.id, resolution: resolution.trim() }).unwrap();
      toast.success('Reclamo resuelto');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo resolver el reclamo.'));
    }
  };

  return (
    <div className='document-slot is-versioned is-filled'>
      <div className='document-slot-row'>
        <div className='document-slot-text'>
          <div className='document-slot-title'>
            <strong>{CLAIM_REASON_LABEL[claim.reason]}</strong>
            <span className={`document-state is-${claim.status === 'OPEN' ? 'danger' : 'success'}`}>
              {claim.status === 'OPEN' ? 'Abierto' : 'Resuelto'}
            </span>
          </div>
          <small className='font-light'>
            {claim.description}
            <br />
            {claim.createdByName} · {formatDateTime(claim.createdAt)}
            {claim.resolution && (
              <>
                <br />
                Resolución: {claim.resolution}
                {claim.resolvedAt && ` · ${formatDate(claim.resolvedAt)}`}
              </>
            )}
          </small>
        </div>
      </div>

      {resolvable && (
        <div className='document-review'>
          {!abierto ? (
            <div className='document-review-actions'>
              <button type='button' className='btn btn-primary btn-sm' onClick={() => setAbierto(true)}>
                Resolver reclamo
              </button>
            </div>
          ) : (
            <>
              <label className='form-label' htmlFor={`resolucion-${claim.id}`}>
                Cómo se resolvió
              </label>
              <textarea
                id={`resolucion-${claim.id}`}
                className='form-control'
                rows={3}
                maxLength={1000}
                placeholder='El proveedor repuso las 2 cajas el 5 de noviembre.'
                value={resolution}
                onChange={(event) => setResolution(event.target.value)}
              />
              <small className='font-light'>
                Lo leen el comprador y el proveedor. Al resolverlo, el pedido sigue su curso y
                entra en la próxima liquidación.
              </small>
              <div className='document-review-actions'>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  disabled={isLoading || !resolution.trim()}
                  onClick={resolver}
                >
                  {isLoading ? 'Guardando...' : 'Marcar como resuelto'}
                </button>
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm'
                  disabled={isLoading}
                  onClick={() => setAbierto(false)}
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* Reportar un problema: que paso y con que. */
const ClaimForm = ({ order }: { order: Order }) => {
  const [open, { isLoading }] = useOpenClaimMutation();
  const [abierto, setAbierto] = useState(false);
  const [reason, setReason] = useState<ClaimReason | ''>('');
  const [description, setDescription] = useState('');

  if (!abierto) {
    return (
      <div className='order-claim-cta'>
        <p className='font-light mb-0'>
          ¿Algo no llegó bien? Tienes hasta el {formatDateTime(order.claimableUntil)} para reclamar.
        </p>
        <button
          type='button'
          className='btn btn-outline-danger btn-sm btn-with-icon'
          onClick={() => setAbierto(true)}
        >
          <AlertCircle size={14} /> Tengo un problema con este pedido
        </button>
      </div>
    );
  }

  const enviar = async () => {
    if (!reason) return;
    try {
      await open({ id: order.id, reason, description: description.trim() }).unwrap();
      toast.success('Reclamo enviado. Suminia lo revisa y te contamos');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo enviar el reclamo.'));
    }
  };

  return (
    <div className='order-payment-form'>
      <h3 className='order-subhead'>Cuéntanos qué pasó</h3>
      <label className='form-label' htmlFor='reclamo-motivo'>
        Motivo
      </label>
      <select
        id='reclamo-motivo'
        className='form-control'
        value={reason}
        onChange={(event) => setReason(event.target.value as ClaimReason)}
      >
        <option value='' disabled>
          Elige una opción
        </option>
        {Object.entries(CLAIM_REASON_LABEL).map(([valor, nombre]) => (
          <option key={valor} value={valor}>
            {nombre}
          </option>
        ))}
      </select>
      <label className='form-label mt-3' htmlFor='reclamo-detalle'>
        Qué pasó
      </label>
      <textarea
        id='reclamo-detalle'
        className='form-control'
        rows={3}
        maxLength={1000}
        placeholder='Llegaron 2 cajas con el sello roto.'
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <small className='font-light'>
        Mientras lo revisamos, el pedido no se cierra y no se le paga al proveedor.
      </small>
      <div className='order-payment-actions'>
        <button
          type='button'
          className='btn btn-outline-danger btn-sm'
          disabled={isLoading || !reason || !description.trim()}
          onClick={enviar}
        >
          {isLoading ? 'Enviando...' : 'Enviar reclamo'}
        </button>
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm'
          disabled={isLoading}
          onClick={() => setAbierto(false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default OrderClaimPanel;
