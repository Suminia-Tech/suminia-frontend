'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { ExternalLink, Upload } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate, formatDateTime } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useGetPaymentInstructionsQuery,
  useRecordRefundMutation,
  useReviewPaymentMutation,
  useSubmitPaymentMutation,
} from '../../api/ordersApi';
import { FILE_ACCEPT, useOrderFiles } from '../../hooks/useOrderFiles';
import {
  buyerCanPay,
  needsRefund,
  PAYMENT_METHOD_LABEL,
  paymentSummary,
  supplierWaitsPayment,
} from '../../lib/orderStatus';
import type { Order, OrderPayment } from '../../model/order.types';
import type { OrderSide } from './OrdersListScreen';

/* El pago del pedido, visto desde cada lado.

   El comprador ve a donde transferir y sube el comprobante; el proveedor solo
   sabe si ya puede despachar —los comprobantes son entre el comprador y
   Suminia—; el personal de Suminia verifica cada comprobante contra el banco
   y, si un pedido pagado se cae, registra la devolucion.

   Cada comprobante se pinta como cualquier documento de la app: el mismo
   document-slot con su estado y su "Ver". */

const pesos = (valor: number, moneda = 'COP') =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

const COMPROBANTE_ESTADO: Record<OrderPayment['status'], { label: string; tone: string }> = {
  SUBMITTED: { label: 'Por verificar', tone: 'neutral' },
  APPROVED: { label: 'Verificado', tone: 'success' },
  REJECTED: { label: 'Rechazado', tone: 'danger' },
};

interface OrderPaymentPanelProps {
  order: Order;
  side: OrderSide;
}

export const OrderPaymentPanel = ({ order, side }: OrderPaymentPanelProps) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const puedeVerificar = side === 'staff' && hasPermission(permissions, 'payment:verify');
  const puedeDevolver = side === 'staff' && hasPermission(permissions, 'finance:manage');
  const resumen = paymentSummary(order, side === 'staff' ? 'staff' : side);
  const files = useOrderFiles(order.id);

  return (
    <Panel
      title='Pago'
      aside={
        resumen && (
          <span className={`document-state is-${resumen.tone}`}>{resumen.label}</span>
        )
      }
    >
      <ul className='data-list is-single'>
        <li>
          <span className='font-light'>Forma de pago</span>
          <span>
            {PAYMENT_METHOD_LABEL[order.paymentMethod]}
            {order.paymentMethod === 'CREDIT' && order.creditDays
              ? ` a ${order.creditDays} días`
              : ''}
          </span>
        </li>
        <li>
          <span className='font-light'>Total a pagar</span>
          <span>{pesos(order.total, order.currency)}</span>
        </li>
        {order.paymentDueAt && order.paymentStatus === 'PENDING' && (
          <li>
            <span className='font-light'>
              {side === 'buyer' ? 'Paga antes del' : 'Plazo para pagar'}
            </span>
            <span>
              {order.paymentMethod === 'TRANSFER'
                ? formatDateTime(order.paymentDueAt)
                : formatDate(order.paymentDueAt)}
            </span>
          </li>
        )}
        {order.paidAt && (
          <li>
            <span className='font-light'>Pagado el</span>
            <span>{formatDate(order.paidAt)}</span>
          </li>
        )}
      </ul>

      <PaymentHint order={order} side={side} />

      {side === 'buyer' && buyerCanPay(order) && <BuyerPaymentForm order={order} files={files} />}

      {side !== 'supplier' && order.payments.length > 0 && (
        <div className='document-slots mt-3'>
          {[...order.payments].reverse().map((payment) => (
            <PaymentSlot
              key={payment.id}
              order={order}
              payment={payment}
              reviewable={puedeVerificar && payment.status === 'SUBMITTED'}
              onOpen={() => files.open(payment.storageKey)}
              opening={files.opening === payment.storageKey}
            />
          ))}
        </div>
      )}

      {order.refund && (
        <div className='document-slots mt-3'>
          <div className='document-slot is-filled is-versioned'>
            <div className='document-slot-row'>
              <div className='document-slot-text'>
                <div className='document-slot-title'>
                  <strong>Devolución al comprador</strong>
                  <span className='document-state is-muted'>Devuelto</span>
                </div>
                <small className='font-light'>
                  {formatDate(order.refund.at)}
                  {order.refund.note && ` · ${order.refund.note}`}
                </small>
              </div>
              {order.refund.storageKey && side !== 'supplier' && (
                <div className='document-slot-actions'>
                  <button
                    type='button'
                    className='btn btn-outline-secondary btn-sm btn-with-icon'
                    disabled={files.opening === order.refund.storageKey}
                    onClick={() => files.open(order.refund!.storageKey!)}
                  >
                    <ExternalLink size={14} /> Ver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {puedeDevolver && needsRefund(order) && <RefundForm order={order} files={files} />}
    </Panel>
  );
};

/* Lo que le toca a cada lado, en una frase. */
const PaymentHint = ({ order, side }: OrderPaymentPanelProps) => {
  const texto = (() => {
    if (order.paymentStatus === 'REFUNDED') return null;
    if (['CANCELLED', 'REJECTED'].includes(order.status)) {
      return order.paymentStatus === 'PAID'
        ? side === 'buyer'
          ? 'El pedido se canceló después de pagado. Suminia te devuelve la plata a tu cuenta.'
          : side === 'staff'
            ? 'El pedido se canceló después de pagado: hay que devolverle la plata al comprador.'
            : null
        : null;
    }
    if (order.paymentStatus === 'PAID') {
      return side === 'supplier' && order.status === 'CONFIRMED'
        ? 'Suminia verificó el pago. Ya puedes despacharlo.'
        : null;
    }
    if (order.paymentStatus === 'SUBMITTED') {
      return side === 'buyer'
        ? 'Recibimos tu comprobante. Lo estamos verificando y te avisamos en cuanto quede.'
        : side === 'supplier'
          ? 'El comprador envió su comprobante. Te avisamos en cuanto Suminia lo verifique para que despaches.'
          : 'Verifica el comprobante contra el banco antes de aprobarlo.';
    }
    if (order.paymentMethod === 'CREDIT') {
      if (side === 'supplier') return 'Va a crédito con Suminia: despáchalo sin esperar el pago.';
      return order.paymentDueAt
        ? `Va a crédito: el pago vence el ${formatDate(order.paymentDueAt)}.`
        : 'Va a crédito: el plazo para pagar empieza a contar con la entrega.';
    }
    if (order.status === 'PLACED' || order.status === 'AWAITING_BUYER') {
      return side === 'buyer'
        ? 'Pagas por transferencia cuando el proveedor confirme el pedido: si no puede atenderlo, no hay nada que devolverte.'
        : null;
    }
    if (supplierWaitsPayment(order)) {
      return side === 'supplier'
        ? 'Esperando el pago del comprador. No lo despaches todavía: te avisamos cuando Suminia lo verifique.'
        : side === 'staff'
          ? 'Esperando el comprobante del comprador. Si vence el plazo, el pedido se cancela solo.'
          : null;
    }
    return null;
  })();

  return texto ? <p className='font-light order-payment-hint'>{texto}</p> : null;
};

type Files = ReturnType<typeof useOrderFiles>;

/* A donde transferir y el comprobante. */
const BuyerPaymentForm = ({ order, files }: { order: Order; files: Files }) => {
  const { data } = useGetPaymentInstructionsQuery();
  const [submit, { isLoading }] = useSubmitPaymentMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState(String(order.total));
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);
  const cuenta = data?.data;

  const enviar = async () => {
    if (!file) return;
    setError(null);
    try {
      const subido = await files.upload('payment', file);
      await submit({
        id: order.id,
        amount: Number(amount),
        ...(reference.trim() ? { reference: reference.trim() } : {}),
        storageKey: subido.storageKey,
        filename: subido.filename,
      }).unwrap();
      toast.success('Comprobante enviado. Te avisamos cuando lo verifiquemos');
      setFile(null);
      setReference('');
    } catch (err) {
      setError(err instanceof Error ? err.message : extractErrorMessage(err, 'No se pudo enviar el comprobante.'));
    }
  };

  return (
    <div className='order-payment-form'>
      {cuenta && !cuenta.configured && (
        <div className='alert alert-warning'>
          Suminia todavía no ha registrado su cuenta para recibir pagos. Escríbenos para
          pagar este pedido.
        </div>
      )}
      {cuenta?.configured && (
        <>
          <h3 className='order-subhead'>Transfiere a Suminia</h3>
          <ul className='data-list is-single'>
            {cuenta.bankName && (
              <li>
                <span className='font-light'>Banco</span>
                <span>{cuenta.bankName}</span>
              </li>
            )}
            {cuenta.accountNumber && (
              <li>
                <span className='font-light'>
                  Cuenta{cuenta.accountType ? ` ${cuenta.accountType.toLowerCase()}` : ''}
                </span>
                <span>{cuenta.accountNumber}</span>
              </li>
            )}
            {cuenta.accountHolder && (
              <li>
                <span className='font-light'>Titular</span>
                <span>
                  {cuenta.accountHolder}
                  {cuenta.accountHolderTaxId && ` · NIT ${cuenta.accountHolderTaxId}`}
                </span>
              </li>
            )}
            {cuenta.breBKey && (
              <li>
                <span className='font-light'>Llave Bre-B</span>
                <span>{cuenta.breBKey}</span>
              </li>
            )}
            <li>
              <span className='font-light'>Referencia</span>
              <span>{order.code}</span>
            </li>
          </ul>
          {cuenta.paymentInstructions && (
            <p className='font-light order-payment-hint'>{cuenta.paymentInstructions}</p>
          )}
        </>
      )}

      <h3 className='order-subhead'>Sube el comprobante</h3>
      <div className='order-payment-fields'>
        <div>
          <label className='form-label' htmlFor='pago-valor'>
            Valor transferido
          </label>
          <input
            id='pago-valor'
            type='number'
            min={1}
            className='form-control'
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <div>
          <label className='form-label' htmlFor='pago-referencia'>
            Número de la transferencia (opcional)
          </label>
          <input
            id='pago-referencia'
            type='text'
            maxLength={120}
            className='form-control'
            value={reference}
            onChange={(event) => setReference(event.target.value)}
          />
        </div>
      </div>

      <div className='order-payment-actions'>
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm btn-with-icon'
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} /> {file ? file.name : 'Elegir archivo'}
        </button>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          disabled={!file || !Number(amount) || isLoading || files.uploading}
          onClick={enviar}
        >
          {isLoading || files.uploading ? 'Enviando...' : 'Enviar comprobante'}
        </button>
      </div>
      <input
        ref={inputRef}
        type='file'
        accept={FILE_ACCEPT}
        className='d-none'
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setFile(event.target.files?.[0] ?? null);
          event.target.value = '';
        }}
      />
      {error && <div className='alert alert-danger mt-3'>{error}</div>}
    </div>
  );
};

/* Un comprobante con su estado y, para quien verifica, aprobar o rechazar.
   La diferencia con el total se dice antes de decidir: es lo primero que
   hay que mirar. */
const PaymentSlot = ({
  order,
  payment,
  reviewable,
  onOpen,
  opening,
}: {
  order: Order;
  payment: OrderPayment;
  reviewable: boolean;
  onOpen: () => void;
  opening: boolean;
}) => {
  const [review, { isLoading }] = useReviewPaymentMutation();
  const [mode, setMode] = useState<'idle' | 'approve' | 'reject'>('idle');
  const [note, setNote] = useState('');
  const estado = COMPROBANTE_ESTADO[payment.status];
  const diferencia = payment.amount - order.total;

  const decidir = async (decision: 'APPROVE' | 'REJECT') => {
    try {
      await review({
        id: order.id,
        paymentId: payment.id,
        decision,
        ...(note.trim() ? { note: note.trim() } : {}),
      }).unwrap();
      toast.success(decision === 'APPROVE' ? 'Pago verificado' : 'Comprobante rechazado');
      setMode('idle');
      setNote('');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo guardar la revisión.'));
    }
  };

  return (
    <div className='document-slot is-filled is-versioned'>
      <div className='document-slot-row'>
        <div className='document-slot-text'>
          <div className='document-slot-title'>
            <strong>Comprobante por {pesos(payment.amount, order.currency)}</strong>
            <span className={`document-state is-${estado.tone}`}>{estado.label}</span>
          </div>
          <small className='font-light'>
            {[
              `Enviado por ${payment.submittedByName} el ${formatDateTime(payment.createdAt)}`,
              payment.reference && `ref. ${payment.reference}`,
              diferencia !== 0 &&
                `${diferencia > 0 ? 'sobran' : 'faltan'} ${pesos(Math.abs(diferencia), order.currency)} frente al total`,
            ]
              .filter(Boolean)
              .join(' · ')}
            {payment.reviewNote && (
              <>
                <br />
                {payment.status === 'REJECTED' ? 'Motivo: ' : 'Nota: '}
                {payment.reviewNote}
              </>
            )}
          </small>
        </div>
        <div className='document-slot-actions'>
          <button
            type='button'
            className='btn btn-outline-secondary btn-sm btn-with-icon'
            disabled={opening}
            onClick={onOpen}
          >
            <ExternalLink size={14} /> Ver
          </button>
        </div>
      </div>

      {reviewable && (
        <div className='document-review'>
          {mode === 'idle' && (
            <div className='document-review-actions'>
              <button type='button' className='btn btn-primary btn-sm' onClick={() => setMode('approve')}>
                Verificar pago
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
          {mode !== 'idle' && (
            <>
              <label className='form-label' htmlFor={`nota-${payment.id}`}>
                {mode === 'reject'
                  ? 'Qué no cuadra'
                  : diferencia !== 0
                    ? 'Nota sobre la diferencia'
                    : 'Nota (opcional)'}
              </label>
              <textarea
                id={`nota-${payment.id}`}
                className='form-control'
                rows={2}
                maxLength={500}
                placeholder={
                  mode === 'reject'
                    ? 'El valor no coincide con el total del pedido.'
                    : 'Llegaron $500 menos por el costo de la transferencia.'
                }
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <small className='font-light'>El comprador la va a leer.</small>
              <div className='document-review-actions'>
                <button
                  type='button'
                  className={mode === 'reject' ? 'btn btn-outline-danger btn-sm' : 'btn btn-primary btn-sm'}
                  disabled={isLoading || (mode === 'reject' && !note.trim())}
                  onClick={() => decidir(mode === 'reject' ? 'REJECT' : 'APPROVE')}
                >
                  {isLoading
                    ? 'Guardando...'
                    : mode === 'reject'
                      ? 'Rechazar comprobante'
                      : 'Confirmar pago'}
                </button>
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm'
                  disabled={isLoading}
                  onClick={() => setMode('idle')}
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

/* La devolucion: Suminia transfiere y sube el comprobante. */
const RefundForm = ({ order, files }: { order: Order; files: Files }) => {
  const [record, { isLoading }] = useRecordRefundMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');

  const enviar = async () => {
    if (!file) return;
    try {
      const subido = await files.upload('refund', file);
      await record({
        id: order.id,
        storageKey: subido.storageKey,
        filename: subido.filename,
        ...(note.trim() ? { note: note.trim() } : {}),
      }).unwrap();
      toast.success('Devolución registrada');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : extractErrorMessage(err, 'No se pudo registrar.'));
    }
  };

  return (
    <div className='order-payment-form'>
      <h3 className='order-subhead'>Registrar la devolución</h3>
      <p className='font-light order-payment-hint'>
        Transfiere {pesos(order.total, order.currency)} al comprador y sube el comprobante.
      </p>
      <label className='form-label' htmlFor='devolucion-nota'>
        Nota (opcional)
      </label>
      <input
        id='devolucion-nota'
        type='text'
        maxLength={500}
        className='form-control'
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <div className='order-payment-actions'>
        <button
          type='button'
          className='btn btn-outline-secondary btn-sm btn-with-icon'
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} /> {file ? file.name : 'Elegir comprobante'}
        </button>
        <button
          type='button'
          className='btn btn-primary btn-sm'
          disabled={!file || isLoading || files.uploading}
          onClick={enviar}
        >
          {isLoading || files.uploading ? 'Guardando...' : 'Registrar devolución'}
        </button>
      </div>
      <input
        ref={inputRef}
        type='file'
        accept={FILE_ACCEPT}
        className='d-none'
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setFile(event.target.files?.[0] ?? null);
          event.target.value = '';
        }}
      />
    </div>
  );
};

export default OrderPaymentPanel;
