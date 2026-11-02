'use client';

import { useRouter } from 'next/navigation';
import { FileText } from 'react-feather';
import { toast } from 'react-toastify';

import { extractErrorMessage } from '@/shared/lib/apiError';

import { useCreateQuoteMutation } from '../../api/ordersApi';
import { useQuotePdf } from '../../hooks/useQuotePdf';

/* La cotizacion formal sale del carrito tal como esta: la clinica la descarga,
   la pasa a aprobacion y, aprobada, la convierte en pedido a esos precios.
   Va en el carrito porque es ahi donde se arma la compra. */
export const CreateQuoteButton = () => {
  const router = useRouter();
  const [create, { isLoading }] = useCreateQuoteMutation();
  const { download, downloading } = useQuotePdf();

  const cotizar = async () => {
    try {
      const quote = (await create().unwrap()).data;
      toast.success(`Cotización ${quote.code} lista`);
      await download(quote.id, quote.code);
      router.push(`/buyer/account/quotes/${quote.id}`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo crear la cotización.'));
    }
  };

  return (
    <div className='quote-from-cart'>
      <div>
        <strong>¿Necesitas aprobar la compra antes de pedir?</strong>
        <small className='font-light'>
          Descarga una cotización formal con estos precios. La conviertes en pedido cuando
          la aprueben, mientras esté vigente.
        </small>
      </div>
      <button
        type='button'
        className='btn btn-outline-secondary btn-sm btn-with-icon'
        disabled={isLoading || downloading !== null}
        onClick={cotizar}
      >
        <FileText size={14} /> {isLoading || downloading ? 'Preparando...' : 'Descargar cotización'}
      </button>
    </div>
  );
};

export default CreateQuoteButton;
