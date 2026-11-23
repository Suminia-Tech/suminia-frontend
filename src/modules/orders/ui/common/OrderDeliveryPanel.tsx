'use client';

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, CheckCircle, ExternalLink, Upload } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDateTime } from '@/shared/lib/dates';
import { Panel } from '@/shared/ui';

import { useChangeOrderStatusMutation } from '../../api/ordersApi';
import { FILE_ACCEPT, useOrderFiles } from '../../hooks/useOrderFiles';
import { supplierCanConfirmDelivery } from '../../lib/orderStatus';
import type { DeliveryProofType, Order } from '../../model/order.types';
import type { OrderSide } from './OrdersListScreen';

/* La entrega del pedido y su prueba.

   El proveedor no da por entregado un pedido con un clic: dice cuando y a
   quien se lo entrego, y adjunta con que lo soporta —la remision firmada por
   el cliente, la confirmacion de la transportadora, una constancia digital o
   una foto—. Es lo que Suminia saca si el comprador dice que no le llego.

   La prueba la ven el proveedor y Suminia, no el comprador: la remision va
   con el membrete del proveedor. Si quien confirma es el comprador, con su
   "Ya lo recibí", no hay prueba que pedir: su confirmacion lo es. */

/* El ancla del formulario: el aviso de la columna lateral lleva hasta aqui. */
export const DELIVERY_FORM_ID = 'confirmacion-entrega';

const TIPOS: { value: DeliveryProofType; label: string }[] = [
  { value: 'REMISSION', label: 'Remisión firmada por el cliente' },
  { value: 'CARRIER', label: 'Confirmación del operador logístico' },
  { value: 'DIGITAL', label: 'Constancia digital' },
  { value: 'PHOTO', label: 'Fotografía de la entrega' },
];

const etiquetaDe = (tipo: DeliveryProofType) =>
  TIPOS.find((t) => t.value === tipo)?.label ?? 'Documento adjunto';

/* Ahora en hora de Colombia, como lo pide un campo datetime-local. */
const ahoraEnColombia = () =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(new Date())
    .replace(' ', 'T');

const OrderDeliveryPanel = ({ order, side }: { order: Order; side: OrderSide }) => {
  const prueba = order.deliveryProof;
  const puedeConfirmar = side === 'supplier' && supplierCanConfirmDelivery(order.status);

  if (prueba && side !== 'buyer') return <DeliveryProofSummary order={order} />;
  if (puedeConfirmar) return <SupplierDeliveryForm order={order} />;
  return null;
};

const DeliveryProofSummary = ({ order }: { order: Order }) => {
  const files = useOrderFiles(order.id);
  const prueba = order.deliveryProof!;
  return (
    <Panel title='Confirmación de entrega'>
      {/* Las dos columnas de la ficha y el documento en una sola fila, como
          en los documentos del producto. El chulo verde ya dice que esta
          adjunta: una etiqueta "Adjuntada" al lado lo repetia. */}
      <ul className='data-list delivery-proof-list'>
        <li>
          <span className='font-light'>Fecha de entrega</span>
          <span>{formatDateTime(prueba.receivedAt)}</span>
        </li>
        <li>
          <span className='font-light'>Recibido por</span>
          <span>{prueba.receivedBy}</span>
        </li>
        {prueba.complete !== null && (
          <li>
            <span className='font-light'>Cantidad recibida</span>
            <span className={prueba.complete ? undefined : 'availability-missing'}>
              {prueba.complete ? 'Completa' : 'Incompleta'}
            </span>
          </li>
        )}
      </ul>
      <div className='document-slots mt-3'>
        <div className='document-slot is-filled'>
          <span className='document-slot-icon'>
            <CheckCircle size={20} />
          </span>
          <div className='document-slot-text'>
            <strong>{etiquetaDe(prueba.type)}</strong>
            <small className='font-light'>{prueba.filename ?? 'Documento adjunto'}</small>
          </div>
          <button
            type='button'
            className='btn btn-outline-secondary btn-sm btn-with-icon'
            disabled={files.opening === prueba.storageKey}
            onClick={() => files.open(prueba.storageKey)}
          >
            <ExternalLink size={14} /> Ver
          </button>
        </div>
      </div>
    </Panel>
  );
};

const SupplierDeliveryForm = ({ order }: { order: Order }) => {
  const files = useOrderFiles(order.id);
  const [changeStatus, { isLoading }] = useChangeOrderStatusMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [cuando, setCuando] = useState('');
  const [recibio, setRecibio] = useState('');
  const [tipo, setTipo] = useState<DeliveryProofType | ''>('');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [completa, setCompleta] = useState<boolean | null>(null);

  const completo =
    cuando !== '' &&
    recibio.trim() !== '' &&
    tipo !== '' &&
    archivo !== null &&
    completa !== null;
  const ocupado = isLoading || files.uploading;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tipo || !archivo || !completo) return;
    try {
      const subido = await files.upload('delivery', archivo);
      await changeStatus({
        id: order.id,
        status: 'DELIVERED',
        delivery: {
          /* El campo da la hora de Colombia, sin zona: se la pone aqui. */
          receivedAt: new Date(`${cuando}:00-05:00`).toISOString(),
          receivedBy: recibio.trim(),
          proofType: tipo,
          storageKey: subido.storageKey,
          filename: subido.filename,
          complete: completa === true,
        },
      }).unwrap();
      toast.success('Entrega confirmada');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : extractErrorMessage(err, 'No se pudo confirmar la entrega.'),
      );
    }
  };

  return (
    <div id={DELIVERY_FORM_ID} className='scroll-anchor'>
      <Panel
        title='Confirmación de entrega'
        description='Registra la fecha de entrega, quién recibió el pedido y si la cantidad recibida está completa, como consta en la remisión, y adjunta la prueba de entrega.'
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className='form-grid'>
            <div>
              <label className='form-label' htmlFor='entrega-fecha'>
                Fecha y hora de entrega
              </label>
              <input
                id='entrega-fecha'
                type='datetime-local'
                className='form-control'
                max={ahoraEnColombia()}
                value={cuando}
                onChange={(event) => setCuando(event.target.value)}
              />
            </div>
            <div>
              <label className='form-label' htmlFor='entrega-recibio'>
                Recibido por
              </label>
              <input
                id='entrega-recibio'
                type='text'
                className='form-control'
                maxLength={120}
                placeholder='Nombre o cargo de quien recibió'
                value={recibio}
                onChange={(event) => setRecibio(event.target.value)}
              />
            </div>
          </div>

          <fieldset className='form-question mt-3'>
            <legend className='form-label'>Cantidad recibida</legend>
            {(
              [
                { value: true, label: 'Completa' },
                { value: false, label: 'Incompleta' },
              ] as const
            ).map((opcion) => (
              <div className='form-check' key={String(opcion.value)}>
                <input
                  id={`entrega-completa-${opcion.value}`}
                  type='radio'
                  name='entrega-completa'
                  className='form-check-input'
                  checked={completa === opcion.value}
                  onChange={() => setCompleta(opcion.value)}
                />
                <label className='form-check-label' htmlFor={`entrega-completa-${opcion.value}`}>
                  {opcion.label}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset className='form-question mt-3 mb-3'>
            <legend className='form-label'>Prueba de entrega</legend>
            {TIPOS.map((opcion) => (
              <div className='form-check' key={opcion.value}>
                <input
                  id={`entrega-tipo-${opcion.value}`}
                  type='radio'
                  name='entrega-tipo'
                  className='form-check-input'
                  checked={tipo === opcion.value}
                  onChange={() => setTipo(opcion.value)}
                />
                <label className='form-check-label' htmlFor={`entrega-tipo-${opcion.value}`}>
                  {opcion.label}
                </label>
              </div>
            ))}
          </fieldset>

          <div className='d-flex flex-wrap gap-2'>
            <button
              type='button'
              className='btn btn-outline-secondary btn-sm btn-with-icon'
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={14} /> {archivo ? archivo.name : 'Elegir archivo'}
            </button>
            <button
              type='submit'
              className='btn btn-primary btn-sm btn-with-icon'
              disabled={ocupado || !completo}
            >
              <Check size={14} />
              {ocupado ? 'Confirmando...' : 'Confirmar entrega'}
            </button>
          </div>
          <small className='font-light d-block mt-2'>En PDF, JPG o PNG.</small>
          <input
            ref={inputRef}
            type='file'
            accept={FILE_ACCEPT}
            className='d-none'
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setArchivo(event.target.files?.[0] ?? null);
              event.target.value = '';
            }}
          />
        </form>
      </Panel>
    </div>
  );
};

export default OrderDeliveryPanel;
