'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ComponentType } from 'react';
import { ChevronLeft, Download } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { formatDate, formatDay } from '@/shared/lib/dates';
import { PageSkeleton, Panel } from '@/shared/ui';
import { useAppSelector } from '@/store/hooks';

import { useConvertQuoteMutation, useGetQuoteQuery } from '../../api/ordersApi';
import { useQuotePdf } from '../../hooks/useQuotePdf';
import type { PaymentMethod, Quote, QuoteSummary } from '../../model/order.types';
import PaymentMethodPicker from '../common/PaymentMethodPicker';

const pesos = (valor: number, moneda: string) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);

/* Vigente, vencida o ya convertida: lo que importa de una cotizacion. */
export const quoteState = (quote: Pick<QuoteSummary, 'status' | 'expired'>) =>
  quote.status === 'CONVERTED'
    ? { label: 'Convertida en pedido', pill: 'status-success', tone: 'success' }
    : quote.expired
      ? { label: 'Vencida', pill: 'status-muted', tone: 'muted' }
      : { label: 'Vigente', pill: 'status-neutral', tone: 'neutral' };

interface QuoteDetailScreenProps {
  quoteId: string;
  /* La eleccion de sede la pone la pagina, como en el checkout: es del modulo
     organizations, y un modulo no importa otro. */
  LocationPicker: ComponentType<{
    value: string;
    onChange: (locationId: string) => void;
  }>;
}

/* La ficha de una cotizacion: lo cotizado por proveedor, el PDF y, mientras
   este vigente, convertirla en pedido a esos precios. */
export const QuoteDetailScreen = ({ quoteId, LocationPicker }: QuoteDetailScreenProps) => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const { data, isLoading, isError, error } = useGetQuoteQuery(quoteId, { skip: !hydrated });
  const { download, downloading } = useQuotePdf();

  if (!hydrated || isLoading) return <PageSkeleton variant='detail' />;
  if (isError || !data) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar la cotización.')}
      </div>
    );
  }

  const quote = data.data;
  const estado = quoteState(quote);
  const proveedores = [...new Set(quote.items.map((item) => item.supplierName))];

  return (
    <>
      <Link
        href='/buyer/account/quotes'
        className='font-light d-inline-flex align-items-center gap-1 mb-3'
      >
        <ChevronLeft size={16} />
        Cotizaciones
      </Link>

      <div className='order-head'>
        <div>
          <h1>Cotización {quote.code}</h1>
          <p className='font-light mb-0'>
            {formatDate(quote.createdAt)} · pidió {quote.createdByName} · vigente hasta el{' '}
            {formatDay(quote.validUntil)}
          </p>
        </div>
        <span className={`document-state is-${estado.tone}`}>{estado.label}</span>
      </div>

      <div className='order-layout'>
        <div className='order-main'>
          <Panel title='Lo cotizado'>
            {proveedores.map((proveedor) => (
              <div key={proveedor} className='quote-supplier'>
                <h3 className='order-subhead'>{proveedor}</h3>
                <ul className='order-items'>
                  {quote.items
                    .filter((item) => item.supplierName === proveedor)
                    .map((item) => (
                      <li key={item.id}>
                        <span className='order-item-name'>
                          {item.productName}
                          <small className='font-light'>
                            {item.presentationName === item.packaging
                              ? item.presentationName
                              : `${item.presentationName} · ${item.packaging}`}
                            {item.cum && ` · CUM ${item.cum}`}
                          </small>
                        </span>
                        <span className='order-item-qty'>
                          {item.quantity} × {pesos(item.unitPrice, quote.currency)}
                        </span>
                        <strong>{pesos(item.subtotal, quote.currency)}</strong>
                      </li>
                    ))}
                </ul>
              </div>
            ))}

            <ul className='cart-summary-lines order-totals'>
              <li>
                <span className='font-light'>Subtotal</span>
                <span>{pesos(quote.subtotal, quote.currency)}</span>
              </li>
              <li>
                <span className='font-light'>IVA</span>
                <span>{pesos(quote.tax, quote.currency)}</span>
              </li>
              {quote.shippingDetail.map((envio) => (
                <li key={envio.supplierOrganizationId}>
                  <span className='font-light'>Envío {envio.supplierName}</span>
                  <span>{envio.cost > 0 ? pesos(envio.cost, quote.currency) : 'Gratis'}</span>
                </li>
              ))}
              <li className='cart-summary-total'>
                <span>Total</span>
                <strong>{pesos(quote.total, quote.currency)}</strong>
              </li>
            </ul>
          </Panel>
        </div>

        <aside className='order-side'>
          <Panel className='order-next'>
            <div className='order-actions'>
              <button
                type='button'
                className='btn btn-outline-secondary btn-sm btn-with-icon'
                disabled={downloading !== null}
                onClick={() => download(quote.id, quote.code)}
              >
                <Download size={14} /> {downloading ? 'Descargando...' : 'Descargar PDF'}
              </button>
            </div>
          </Panel>

          {quote.status === 'CONVERTED' ? (
            <Panel title='Pedidos'>
              <p className='font-light'>
                Se convirtió en pedido el {formatDate(quote.convertedAt)}.
              </p>
              <ul className='quote-orders'>
                {quote.orders.map((order) => (
                  <li key={order.id}>
                    <Link href={`/buyer/orders/${order.id}`}>{order.code}</Link>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : quote.expired ? (
            <Panel title='Ya venció'>
              <p className='font-light mb-0'>
                Los precios de esta cotización ya no se respetan. Arma la compra de nuevo en el
                carrito para cotizar con los precios de hoy.
              </p>
            </Panel>
          ) : (
            <ConvertQuote quote={quote} LocationPicker={LocationPicker} />
          )}
        </aside>
      </div>
    </>
  );
};

/* Convertirla en pedido: a donde va y como se paga. El precio es el cotizado;
   lo que se comprueba otra vez es que siga habiendo existencias. */
const ConvertQuote = ({
  quote,
  LocationPicker,
}: {
  quote: Quote;
  LocationPicker: QuoteDetailScreenProps['LocationPicker'];
}) => {
  const router = useRouter();
  const [convert, { isLoading }] = useConvertQuoteMutation();
  const [locationId, setLocationId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFER');
  const [error, setError] = useState<string | null>(null);

  const convertir = async () => {
    setError(null);
    try {
      const pedidos = (
        await convert({
          id: quote.id,
          ...(locationId ? { deliveryLocationId: locationId } : {}),
          paymentMethod,
        }).unwrap()
      ).data;
      toast.success(
        pedidos.length === 1
          ? `Pedido ${pedidos[0].code} enviado a ${pedidos[0].supplierOrganizationName}`
          : `${pedidos.length} pedidos enviados, uno a cada proveedor`,
      );
      router.push(pedidos.length === 1 ? `/buyer/orders/${pedidos[0].id}` : '/buyer/orders');
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo convertir la cotización.'));
    }
  };

  return (
    <Panel
      title='Convertir en pedido'
      description={`A los precios cotizados, hasta el ${formatDay(quote.validUntil)}. El envío se calcula para la sede que elijas.`}
    >
      <h3 className='order-subhead'>¿A dónde lo llevamos?</h3>
      <LocationPicker value={locationId} onChange={setLocationId} />

      <h3 className='order-subhead mt-3'>¿Cómo pagas?</h3>
      <PaymentMethodPicker value={paymentMethod} onChange={setPaymentMethod} total={quote.total} />

      {error && <div className='alert alert-danger mt-3'>{error}</div>}

      <button
        type='button'
        className='btn btn-primary btn-full mt-3'
        disabled={isLoading || !locationId}
        onClick={convertir}
      >
        {isLoading ? 'Convirtiendo...' : 'Hacer el pedido'}
      </button>
    </Panel>
  );
};

export default QuoteDetailScreen;
