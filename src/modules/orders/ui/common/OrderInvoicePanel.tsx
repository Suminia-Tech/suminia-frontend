'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { ExternalLink, Upload } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { useAttachInvoiceMutation } from '../../api/ordersApi';
import { FILE_ACCEPT, useOrderFiles } from '../../hooks/useOrderFiles';
import { supplierCanInvoice } from '../../lib/orderStatus';
import type { Order } from '../../model/order.types';
import type { OrderSide } from './OrdersListScreen';

/* La factura electronica del proveedor al comprador. Un pedido esta facturado
   cuando la adjunta: es lo que el comprador necesita para su contabilidad y lo
   que Suminia mira antes de liquidar.

   Se pinta como cualquier documento de la app. El proveedor la adjunta desde
   que confirma; si se equivoco, la reemplaza. */
export const OrderInvoicePanel = ({ order, side }: { order: Order; side: OrderSide }) => {
  const files = useOrderFiles(order.id);
  const [attach, { isLoading }] = useAttachInvoiceMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [number, setNumber] = useState(order.invoice?.number ?? '');
  const [file, setFile] = useState<File | null>(null);
  const puedeAdjuntar = side === 'supplier' && supplierCanInvoice(order);

  /* Sin factura y sin poder adjuntarla, no hay nada que mostrar. */
  if (!order.invoice && !puedeAdjuntar) return null;

  const guardar = async () => {
    if (!file || !number.trim()) return;
    try {
      const subido = await files.upload('invoice', file);
      await attach({
        id: order.id,
        number: number.trim(),
        storageKey: subido.storageKey,
        filename: subido.filename,
      }).unwrap();
      toast.success('Factura adjuntada');
      setEditing(false);
      setFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : extractErrorMessage(err, 'No se pudo adjuntar.'));
    }
  };

  const formulario = puedeAdjuntar && (editing || !order.invoice);

  return (
    <Panel title='Factura'>
      <div className='document-slots'>
        <div className={`document-slot is-versioned${order.invoice ? ' is-filled' : ' is-missing'}`}>
          <div className='document-slot-row'>
            <div className='document-slot-text'>
              <div className='document-slot-title'>
                <strong>
                  {order.invoice ? `Factura ${order.invoice.number}` : 'Factura electrónica'}
                </strong>
                <span className={`document-state is-${order.invoice ? 'success' : 'neutral'}`}>
                  {order.invoice ? 'Adjuntada' : 'Pendiente'}
                </span>
              </div>
              <small className='font-light'>
                {order.invoice
                  ? `Adjuntada el ${formatDate(order.invoice.attachedAt)}`
                  : 'Adjunta la factura electrónica de venta al comprador. Suminia la revisa antes de liquidarte.'}
              </small>
            </div>
            <div className='document-slot-actions'>
              {order.invoice?.storageKey && (
                <button
                  type='button'
                  className='btn btn-outline-secondary btn-sm btn-with-icon'
                  disabled={files.opening === order.invoice.storageKey}
                  onClick={() => files.open(order.invoice!.storageKey!)}
                >
                  <ExternalLink size={14} /> Ver
                </button>
              )}
              {puedeAdjuntar && order.invoice && !editing && (
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
              <label className='form-label' htmlFor='factura-numero'>
                Número de la factura
              </label>
              <input
                id='factura-numero'
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
