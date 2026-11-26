import type { Metadata } from 'next';
import { Container } from 'reactstrap';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import Layout6 from '@/_template/Layout/Layout6';

export const metadata: Metadata = {
  title: 'Compromisos comerciales para proveedores',
  description:
    'Los compromisos que acepta el proveedor para operar con Suminia: prueba de entrega, devoluciones, precios, lotes y relación con la IPS.',
};

/* Los compromisos que el proveedor acepta en su declaracion, y a los que
   enlaza el formulario. Es publica, como la politica de datos: se tiene que
   poder leer antes de aceptarla. El texto es el que entrego Suminia. */
export default function CommercialCommitmentsPage() {
  return (
    <Layout6 isCategories={true}>
      <BreadCrumb
        parent={'Compromisos comerciales'}
        title={'Compromisos comerciales para proveedores'}
      />
      <section className='section-b-space'>
        <Container>
          <article className='legal-page'>
            <p>
              Con el propósito de construir una relación comercial de largo plazo con
              Suminia S.A.S., el proveedor declara que conoce su modelo de operación y
              acepta los siguientes compromisos.
            </p>

            <h3>1. Prueba de entrega</h3>
            <p>
              El proveedor entregará a Suminia una remisión firmada o una constancia digital
              por cada entrega, incluidas las parciales. El soporte deberá identificar el
              pedido, la sede de la IPS, la fecha, quién recibió los productos y las
              cantidades recibidas.
            </p>

            <h3>2. Recepción de devoluciones</h3>
            <p>
              El proveedor recibirá en su bodega o en la de su operador logístico los
              productos cuya devolución corresponda y coordinará la recogida con Suminia.
              Antes de solicitarla, Suminia verificará la causal, la integridad del
              producto, su presentación y las condiciones de conservación, según el motivo
              de la devolución.
            </p>

            <h3>3. Precio de la orden de compra</h3>
            <p>
              El proveedor aceptará cada orden de compra al precio registrado en ella al
              momento de su generación en la plataforma. Los aumentos posteriores de la
              lista de precios no se aplicarán a órdenes ya generadas.
            </p>

            <h3>4. Precio de las cotizaciones</h3>
            <p>
              Si la IPS realiza el pedido dentro de la vigencia de una cotización formal
              generada en la plataforma, el proveedor respetará el precio cotizado para las
              referencias y cantidades indicadas. Esta protección tendrá una duración máxima
              de 15 días calendario desde la generación de la cotización. Suminia presentará
              al proveedor la cotización como soporte.
            </p>

            <h3>5. Lotes con vencimiento inferior a 12 meses</h3>
            <p>
              Cuando al lote le queden menos de 12 meses para vencer en la fecha prevista de
              entrega, el proveedor enviará a Suminia una carta en la que identifique el
              producto, el lote y su fecha de vencimiento, y se comprometa a recibir su
              devolución. El despacho requerirá la autorización escrita previa de Suminia y
              la conformidad de la IPS.
            </p>

            <h3>6. Relación comercial con la IPS</h3>
            <p>
              Suminia será el contacto comercial de las IPS que vincule. El proveedor
              utilizará la información recibida de Suminia para el envío de los pedidos. Se
              abstendrá de utilizarla para ofrecer, negociar o realizar ventas directas a
              esas IPS.
            </p>
          </article>
        </Container>
      </section>
    </Layout6>
  );
}
