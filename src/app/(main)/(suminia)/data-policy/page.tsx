import type { Metadata } from 'next';
import { Container } from 'reactstrap';

import BreadCrumb from '@/_template/Components/Element/BreadCrumb';
import Layout6 from '@/_template/Layout/Layout6';
import { DATA_POLICY_EFFECTIVE_DATE, DATA_RESPONSIBLE } from '@/shared/config/legal';

export const metadata: Metadata = {
  title: 'Política de Tratamiento de Datos',
  description:
    'Cómo Suminia recolecta, usa y protege los datos personales de proveedores, compradores y usuarios.',
};

/* La politica que el proveedor acepta en su declaracion y a la que enlaza el
   formulario. Es publica: se tiene que poder leer antes de aceptarla, sin
   haber iniciado sesion.

   El texto sigue la Ley 1581 de 2012 y el Decreto 1377 de 2013 (compilado en
   el Decreto 1074 de 2015), que piden identificar al responsable, decir para
   que se usan los datos, que derechos tiene el titular y como ejercerlos. Los
   datos del responsable salen de shared/config/legal.ts para cambiarlos en un
   solo sitio. */
export default function DataPolicyPage() {
  const { name, email, country } = DATA_RESPONSIBLE;

  return (
    <Layout6 isCategories={true}>
      <BreadCrumb
        parent={'Política de Tratamiento de Datos'}
        title={'Política de Tratamiento de Datos'}
      />
      <section className='section-b-space'>
        <Container>
          <article className='legal-page'>
            <p className='font-light'>Vigente desde el {DATA_POLICY_EFFECTIVE_DATE}.</p>

            <h3>1. Responsable del tratamiento</h3>
            <p>
              {name} es el responsable del tratamiento de los datos personales que se
              recolectan a través de su plataforma de comercio entre empresas de
              medicamentos, dispositivos médicos e insumos hospitalarios.
            </p>
            <ul>
              <li>Domicilio: {country}.</li>
              <li>
                Correo electrónico para asuntos de datos personales:{' '}
                <a href={`mailto:${email}`}>{email}</a>.
              </li>
            </ul>

            <h3>2. Marco legal</h3>
            <p>
              Esta política se rige por el artículo 15 de la Constitución Política de
              Colombia, la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 —compilado
              en el Decreto Único Reglamentario 1074 de 2015— y las demás normas que los
              modifiquen o complementen.
            </p>

            <h3>3. Definiciones</h3>
            <ul>
              <li>
                <strong>Dato personal:</strong> cualquier información vinculada o que pueda
                asociarse a una o varias personas naturales determinadas o determinables.
              </li>
              <li>
                <strong>Titular:</strong> la persona natural cuyos datos personales son objeto
                de tratamiento.
              </li>
              <li>
                <strong>Tratamiento:</strong> cualquier operación sobre datos personales, como
                la recolección, almacenamiento, uso, circulación o supresión.
              </li>
              <li>
                <strong>Autorización:</strong> el consentimiento previo, expreso e informado del
                titular para llevar a cabo el tratamiento.
              </li>
              <li>
                <strong>Encargado del tratamiento:</strong> quien realiza el tratamiento por
                cuenta del responsable.
              </li>
            </ul>

            <h3>4. Datos que tratamos</h3>
            <p>Según la relación que cada titular tenga con {name}, tratamos:</p>
            <ul>
              <li>
                <strong>Datos de identificación y contacto</strong> de los representantes
                legales, usuarios y personas de contacto de las empresas proveedoras y
                compradoras: nombre, cargo, correo electrónico y teléfono.
              </li>
              <li>
                <strong>Datos de la empresa</strong> que pueden contener datos personales: NIT,
                razón social, dirección, certificado de existencia y representación legal, RUT,
                composición accionaria y cédula del representante legal.
              </li>
              <li>
                <strong>Datos de la declaración de autocontrol de riesgos</strong> (LA/FT/FP y
                C/ST): origen de los recursos, condición de Persona Expuesta Políticamente
                (PEP) y operaciones internacionales.
              </li>
              <li>
                <strong>Datos financieros</strong> de los proveedores: banco, tipo y número de
                cuenta, titular y su documento, para pagarles lo que les corresponde.
              </li>
              <li>
                <strong>Datos de uso de la plataforma:</strong> pedidos, historial de
                operaciones y registros de acceso.
              </li>
            </ul>

            <h3>5. Finalidades</h3>
            <p>Los datos personales se tratan para:</p>
            <ul>
              <li>Registrar a las empresas y a sus usuarios, y verificar su identidad.</li>
              <li>
                Evaluar y aprobar a las empresas que operan en la plataforma, incluidas las
                consultas en listas vinculantes, listas restrictivas y fuentes públicas para la
                prevención de los riesgos de lavado de activos, financiación del terrorismo,
                financiación de la proliferación de armas de destrucción masiva, corrupción y
                soborno transnacional.
              </li>
              <li>
                Gestionar los pedidos entre compradores y proveedores, sus despachos, pagos y
                facturación.
              </li>
              <li>
                Comunicarnos con las personas de contacto sobre la cuenta, los pedidos y la
                operación del servicio.
              </li>
              <li>Atender consultas, reclamos y solicitudes de los titulares.</li>
              <li>
                Cumplir obligaciones legales, contables, tributarias y de atención a
                requerimientos de autoridades.
              </li>
              <li>
                Enviar información comercial, promociones y novedades, solo a quien lo haya
                autorizado de forma expresa. Esta autorización es opcional y puede retirarse
                en cualquier momento.
              </li>
            </ul>

            <h3>6. Datos sensibles y de menores</h3>
            <p>
              {name} no solicita datos sensibles ni datos de niños, niñas y adolescentes. Si
              en algún caso se pidiera un dato sensible, responder será facultativo y se
              informará de ello al titular.
            </p>

            <h3>7. Derechos de los titulares</h3>
            <p>Como titular de datos personales, usted tiene derecho a:</p>
            <ul>
              <li>Conocer, actualizar y rectificar sus datos personales.</li>
              <li>Solicitar prueba de la autorización otorgada.</li>
              <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
              <li>
                Presentar quejas ante la Superintendencia de Industria y Comercio por
                infracciones a la ley, una vez agotado el trámite ante {name}.
              </li>
              <li>
                Revocar la autorización y solicitar la supresión de sus datos cuando no se
                respeten los principios, derechos y garantías legales, siempre que no exista
                un deber legal o contractual de conservarlos.
              </li>
              <li>Acceder de forma gratuita a sus datos personales.</li>
            </ul>

            <h3>8. Consultas y reclamos</h3>
            <p>
              Las consultas y reclamos se presentan por escrito al correo{' '}
              <a href={`mailto:${email}`}>{email}</a>, indicando el nombre del titular, su
              documento de identidad, la descripción de lo que solicita y un medio de
              respuesta.
            </p>
            <ul>
              <li>
                <strong>Consultas:</strong> se responden en un máximo de diez (10) días hábiles
                desde su recibo. Si no es posible en ese plazo, se informará el motivo y la
                fecha de respuesta, que no superará cinco (5) días hábiles adicionales.
              </li>
              <li>
                <strong>Reclamos:</strong> se responden en un máximo de quince (15) días
                hábiles desde el día siguiente a su recibo, prorrogables por ocho (8) días
                hábiles más, informando el motivo. Si el reclamo está incompleto, se pedirá
                completarlo dentro de los cinco (5) días siguientes; si pasan dos (2) meses
                sin que se complete, se entenderá desistido.
              </li>
            </ul>

            <h3>9. Transmisión y transferencia</h3>
            <p>
              Para prestar el servicio, {name} se apoya en proveedores tecnológicos de
              alojamiento, almacenamiento y envío de correo, que pueden tratar los datos
              como encargados, incluso fuera de Colombia. En esos casos se exige que
              garanticen niveles adecuados de protección conforme a la ley colombiana. Los
              datos de contacto de un proveedor no se comparten con los compradores.
            </p>

            <h3>10. Seguridad</h3>
            <p>
              {name} aplica medidas técnicas, humanas y administrativas razonables para
              proteger los datos personales contra pérdida, consulta, uso o acceso no
              autorizado, entre ellas el acceso restringido por roles y el almacenamiento
              privado de los documentos, que solo se abren mediante enlaces temporales.
            </p>

            <h3>11. Vigencia y cambios</h3>
            <p>
              Esta política rige desde el {DATA_POLICY_EFFECTIVE_DATE}. Los datos se
              conservan mientras sean necesarios para las finalidades descritas y para
              cumplir los deberes legales. Cualquier cambio sustancial se comunicará a los
              titulares antes de aplicarse, por los canales de contacto registrados.
            </p>
          </article>
        </Container>
      </section>
    </Layout6>
  );
}
