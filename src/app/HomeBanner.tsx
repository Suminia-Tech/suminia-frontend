'use client';

import Link from 'next/link';
import { ArrowRight } from 'react-feather';

/* La banda de portada.

   Reaprovecha el fondo que ya estaba en el proyecto —el mismo verde del banner
   anterior— en lugar de traer una imagen nueva. Va como fondo y no como
   fotografia de producto porque es una acuarela: aguanta el reescalado que una
   foto no aguantaria.

   Ancha y baja, no de pantalla completa: la de antes ocupaba 850px de alto y
   empujaba el catalogo por debajo del pliegue, que en una tienda es justo lo
   que no se quiere.

   Sin promocion ni precio tachado: no hay ninguna, e inventarla se descubre al
   entrar. Solo dice que hay y como llegar. */
export const HomeBanner = () => (
  <section className='home-banner-section'>
    <div className='container-fluid-lg'>
      <div className='home-banner'>
        <div className='home-banner-content'>
          <h1>Medicamentos e insumos médicos</h1>
          <p>De proveedores verificados por Suminia.</p>
          <Link href='/catalog' className='btn btn-primary rounded-1'>
            Ver el catálogo
            <ArrowRight size={16} className='ms-1' />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default HomeBanner;
