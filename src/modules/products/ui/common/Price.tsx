import { formatPrice } from '../../lib/productLabels';

/* El precio, o el hueco que deja cuando no se puede ver.

   El backend no lo manda a quien no esta autorizado —con sesion y con la
   empresa aprobada por Suminia—, de modo que aqui llega `null`. Esto no oculta
   nada: pinta lo que no vino.

   Se difumina una cifra falsa en vez de escribir "precio reservado". Que se vea
   que hay un precio ahi, y que hace falta una cuenta aprobada para leerlo, es
   la invitacion a registrarse; un texto plano no dice ni que exista. La cifra
   es inventada y da igual cual sea: la real nunca llego al navegador.

   Al lector de pantalla se le dice la frase, no el numero de mentira. */

interface PriceProps {
  value: number | null;
  currency?: string;
  /** El texto que acompaña al precio tapado. Cambia segun donde se pinte. */
  hiddenLabel?: string;
}

const MESSAGE = 'Precio visible para clientes registrados';

export const Price = ({
  value,
  currency = 'COP',
  hiddenLabel,
}: PriceProps) => {
  if (value !== null) return <>{formatPrice(value, currency)}</>;

  return (
    <span className='price-hidden' title={MESSAGE}>
      <span className='price-hidden-blur' aria-hidden='true'>
        $ 000.000
      </span>
      <span className='visually-hidden'>{MESSAGE}</span>
      {hiddenLabel && <small className='price-hidden-note'>{hiddenLabel}</small>}
    </span>
  );
};

export default Price;
