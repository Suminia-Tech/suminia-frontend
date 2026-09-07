'use client';

import Link from 'next/link';
import { Award, Layers, Search } from 'react-feather';

/* La portada de Suminia.

   Sustituye a lo que traia la plantilla: un carrusel de camisetas y zapatos
   Nike con "70% OFF" y parrafos en Lorem Ipsum. En un marketplace de
   medicamentos eso no era un detalle de estilo, era decirle a un hospital que
   se habia equivocado de sitio.

   Dice lo que Suminia hace y lleva a las dos unicas cosas que se pueden hacer
   sin cuenta: mirar el catalogo y registrar una empresa. No promete lo que
   todavia no existe —comprar, pagar, seguir un envio— porque prometerlo se
   descubre al primer clic. */

const CLAIMS = [
  {
    icon: Search,
    title: 'Busca como pides',
    text: 'Por principio activo, registro sanitario o CUM, no solo por marca comercial.',
  },
  {
    icon: Award,
    title: 'Fichas del INVIMA',
    text: 'La composición y el registro salen del listado oficial de medicamentos vigentes, no los escribe el proveedor.',
  },
  {
    icon: Layers,
    title: 'Varios proveedores, una ficha',
    text: 'El mismo medicamento de distintas empresas queda junto para poder compararlo.',
  },
];

export const HomeHero = () => (
  <>
    <section className='home-hero'>
      <div className='container-fluid-lg'>
        <h1>Medicamentos e insumos médicos para tu institución</h1>
        <p>
          El catálogo de proveedores verificados en Colombia. Consulta
          composición, registro sanitario y formatos de venta antes de comprar.
        </p>
        <div className='home-hero-actions'>
          <Link href='/catalog' className='btn btn-primary rounded-1'>
            Ver el catálogo
          </Link>
          <Link href='/register' className='btn btn-outline-secondary rounded-1'>
            Registrar mi empresa
          </Link>
        </div>
      </div>
    </section>

    <section className='home-claims'>
      <div className='container-fluid-lg'>
        <div className='home-claims-grid'>
          {CLAIMS.map((claim) => (
            <div className='home-claim' key={claim.title}>
              <claim.icon size={20} />
              <h4>{claim.title}</h4>
              <p className='font-light'>{claim.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default HomeHero;
