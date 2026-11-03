'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { ExternalLink, Upload } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { hasPermission } from '@/shared/lib/permissions';
import { Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import {
  useAttachInvoiceMutation,
  useAttachSuminiaInvoiceMutation,
} from '../../api/ordersApi';
import { FILE_ACCEPT, useOrderFiles } from '../../hooks/useOrderFiles';
import { supplierCanInvoice } from '../../lib/orderStatus';
import type { Order } from '../../model/order.types';
import type { OrderSide } from './OrdersListScreen';

/* Las facturas del pedido.

   Suminia le compra al proveedor y le vende al comprador, de modo que hay dos:
   el proveedor le factura a Suminia y despacha con remision, y Suminia le
   factura al comprador cuando verifica su pago (a credito, desde la
   confirmacion). Cada lado ve la suya; el personal de Suminia, las dos.

   Se pintan como cualquier documento de la app, y se adjuntan una vez —si
   hubo un error, se reemplazan—. */

type Variant = 'supplier' | 'suminia';

const COPY: Record<
  Variant,
  { titulo: string; vacio: string; pendienteQuien: string }
> = {
  supplier: {
    titulo: 'Factura a Suminia',
    vacio:
      'Factura a nombre de Suminia el valor que te paga —el total menos la comisión— y despacha con remisión. Suminia la revisa antes de liquidarte.',
    pendienteQuien: 'El proveedor todavía no adjunta su factura a Suminia.',
  },
  suminia: {
    titulo: 'Factura de Suminia',
    vacio: 'Adjunta la factura electrónica que Suminia le emitió al comprador.',
    pendienteQuien: 'Suminia te envía la factura electrónica cuando verifica tu pago.',
  },
};

export const OrderInvoicePanel = ({
  order,
  side,
  variant,
}: {
  order: Order;
  side: OrderSide;
  variant: Variant;
}) => {
  const permissions = useAppSelector((state) => state.auth.user?.permissions);
  const files = useOrderFiles(order.id);
  const [attachSupplier, supplierState] = useAttachInvoiceMutation();
  const [attachSuminia, suminiaState] = useAttachSuminiaInvoiceMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const factura = variant === 'supplier' ? order.invoice : order.suminiaInvoice;
  const [number, setNumber] = useState(factura?.number ?? '');
  const [file, setFile] = useState<File | null>(null);
  const copy = COPY[variant];

  const cobrado = order.paymentMethod === 'CREDIT' || order.paymentStatus === 'PAID';
  const puedeAdjuntar =
    variant === 'supplier'
      ? side === 'supplier' && supplierCanInvoice(order)
      : side === 'staff' &&
        hasPermission(permissions, 'payment:verify') &&
        supplierCanInvoice(order) &&
        cobrado;
  /* Lo que falta se dice a quien lo espera: al comprador, que su factura viene
     en camino; a Suminia, que el proveedor no ha facturado —se le pide antes
     de liquidar—. */
  const avisoPendiente =
    !factura &&
    !puedeAdjuntar &&
    supplierCanInvoice(order) &&
    ((variant === 'suminia' && side === 'buyer') || (variant === 'supplier' && side === 'staff'));

  if (!factura && !puedeAdjuntar && !avisoPendiente) return null;

  const isLoading = supplierState.isLoading || suminiaState.isLoading;

  const guardar = async () => {
    if (!file || !number.trim()) return;
    try {
      const subido = await files.upload(variant === 'supplier' ? 'invoice' : 'suminia_invoice', file);
      const body = {
        id: order.id,
        number: number.trim(),
        storageKey: subido.storageKey,
        filename: subido.filename,
      };
      await (variant === 'supplier' ? attachSupplier(body) : attachSuminia(body)).unwrap();
      toast.success('Factura adjuntada');
      setEditing(false);
      setFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : extractErrorMessage(err, 'No se pudo adjuntar.'));
    }
  };

  const formulario = puedeAdjuntar && (editing || !factura);

  return (
    <Panel title={copy.titulo}>
      <div className='document-slots'>
        <div
          className={`document-slot is-versioned${factura ? ' is-filled' : puedeAdjuntar ? ' is-missing' : ''}`}
        >
          <div className='document-slot-row'>
            <div className='document-slot-text'>
              <div className='document-slot-title'>
                <strong>{factura ? `Factura ${factura.number}` : 'Factura electrónica'}</strong>
                <span className={`document-state is-${factura ? 'success' : 'neutral'}`}>
                  {factura ? 'Adjuntada' : 'Pendiente'}
                </span>
              </div>
              <small className='font-light'>
                {factura
                  ? `Adjuntada el ${formatDate(factura.attachedAt)}`
                  : puedeAdjuntar
                    ? copy.vacio
                    : copy.pendienteQuien}
              </small>
            </div>
            <div className='document-slot-actions'>
              {factura?.storageKey && (
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm btn-with-icon'
                  disabled={files.opening === factura.storageKey}
                  onClick={() => files.open(factura.storageKey!)}
                >
                  <ExternalLink size={14} /> Ver
                </button>
              )}
              {puedeAdjuntar && factura && !editing && (
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm btn-with-icon'
                  onClick={() => setEditing(true)}
                >
                  <Upload size={14} /> Reemplazar
                </button>
              )}
            </div>
          </div>

          {formulario && (
            <div className='document-review'>
              <label className='form-label' htmlFor={`factura-${variant}`}>
                Número de la factura
              </label>
              <input
                id={`factura-${variant}`}
                type='text'
                maxLength={60}
                className='form-control'
                placeholder='FE-10234'
                value={number}
                onChange={(event) => setNumber(event.target.value)}
              />
              <div className='document-review-actions'>
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
                  disabled={!file || !number.trim() || isLoading || files.uploading}
                  onClick={guardar}
                >
                  {isLoading || files.uploading ? 'Adjuntando...' : 'Adjuntar factura'}
                </button>
                {editing && (
                  <button
                    type='button'
                    className='btn btn-outline-secondary btn-sm'
                    onClick={() => setEditing(false)}
                  >
                    Cancelar
                  </button>
                )}
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
          )}
        </div>
      </div>
    </Panel>
  );
};

export default OrderInvoicePanel;
