'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate, formatDateTime } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { ConfirmModal, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useConfirmReceiptMutation,
  useOpenClaimMutation,
  useResolveClaimMutation,
} from '../../api/ordersApi';
import { CLAIM_REASON_LABEL } from '../../lib/orderStatus';
import type { ClaimReason, Order, OrderClaim } from '../../model/order.types';
import type { OrderSide } from './OrdersListScreen';

/* El reclamo del comprador sobre lo que recibio.

   Se abre dentro de los dias de reclamo despues de la entrega. Mientras este
   abierto el pedido no se cierra y no entra en la liquidacion del proveedor:
   no se le paga lo que esta en disputa. Lo resuelve Suminia con lo acordado
   —reposicion, nota credito, sin lugar— y el pedido sigue su curso.

   Junto al reclamo va lo contrario: cerrar el pedido cuando llego bien, sin
   esperar a que pasen los dias. Lo cierra el comprador, o Suminia en su
   nombre si la clinica lo confirma por otro medio.

   El panel no aparece si no hay reclamos ni se puede hacer nada. */
export const OrderClaimPanel = ({ order, side }: { order: Order; side: OrderSide }) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const puedeResolver = side === 'staff' && hasPermission(permissions, 'payment:verify');
  const abierto = order.claims.some((claim) => claim.status === 'OPEN');
  const enPlazo =
    order.status === 'DELIVERED' &&
    order.claimableUntil !== null &&
    new Date(order.claimableUntil) > new Date();
  const puedeReclamar = side === 'buyer' && enPlazo && !abierto;
  const puedeCerrar = enPlazo && !abierto && (side === 'buyer' || puedeResolver);

  if (order.claims.length === 0 && !puedeCerrar) return null;

  return (
    <Panel
      title={order.claims.length > 0 ? 'Reclamos' : 'Recepción del pedido'}
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

      {puedeCerrar && (
        <ClaimForm order={order} side={side} canClaim={puedeReclamar} />
      )}
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

/* Las dos salidas de un pedido entregado: cerrarlo porque llego bien, o
   reportar un problema y contar que paso. */
const ClaimForm = ({
  order,
  side,
  canClaim,
}: {
  order: Order;
  side: OrderSide;
  canClaim: boolean;
}) => {
  const [open, { isLoading }] = useOpenClaimMutation();
  const [confirmReceipt, cierre] = useConfirmReceiptMutation();
  const [abierto, setAbierto] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [reason, setReason] = useState<ClaimReason | ''>('');
  const [description, setDescription] = useState('');
  const enNombre = side === 'staff';

  const cerrar = async () => {
    try {
      await confirmReceipt(order.id).unwrap();
      setConfirmando(false);
      toast.success(`Pedido ${order.code} cerrado`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo cerrar el pedido.'));
    }
  };

  if (!abierto) {
    return (
      <div className='order-claim-cta'>
        <p className='font-light mb-0'>
          {enNombre
            ? `Si ${order.buyerOrganizationName} confirmó que lo recibió bien, puedes cerrarlo en su nombre. Si no, se cierra solo el ${formatDateTime(order.claimableUntil)}.`
            : `Si llegó completo y en buenas condiciones, ciérralo. Si algo no llegó bien, tienes hasta el ${formatDateTime(order.claimableUntil)} para reclamar.`}
        </p>
        <div className='order-claim-actions'>
          <button
            type='button'
            className='btn btn-primary btn-sm btn-with-icon'
            onClick={() => setConfirmando(true)}
          >
            <CheckCircle size={14} /> Cerrar pedido
          </button>
          {canClaim && (
            <button
              type='button'
              className='btn btn-outline-danger btn-sm btn-with-icon'
              onClick={() => setAbierto(true)}
            >
              <AlertCircle size={14} /> Tengo un problema con este pedido
            </button>
          )}
        </div>

        <ConfirmModal
          isOpen={confirmando}
          onClose={() => setConfirmando(false)}
          onConfirm={cerrar}
          title={`¿Cerrar el pedido ${order.code}?`}
          confirmLabel='Sí, cerrar pedido'
          loadingLabel='Cerrando...'
          isLoading={cierre.isLoading}
          tone='primary'
        >
          {enNombre ? (
            <p className='mb-0'>
              ¿Ya confirmaste con {order.buyerOrganizationName} que el pedido llegó completo y en buenas
              condiciones? Al cerrarlo ya no podrá reclamar, y se le paga al proveedor en la
              próxima liquidación.
            </p>
          ) : (
            <p className='mb-0'>
              ¿Ya revisaste que el pedido llegó completo y en buenas condiciones? Al cerrarlo
              ya no podrás abrir un reclamo, y Suminia le paga al proveedor.
            </p>
          )}
        </ConfirmModal>
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
