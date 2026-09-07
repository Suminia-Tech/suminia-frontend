'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Briefcase, Search, Shield } from 'react-feather';

/* Las secciones propias de la portada.

   Sustituyen a la demo de la plantilla —carrusel de camisetas, banners de
   camaras 4K, Lorem Ipsum—, que en un marketplace de medicamentos le decia a un
   hospital que se habia equivocado de sitio.

   Se dice lo que Suminia hace hoy y no lo que hara. No hay cifras de catalogo
   ni "miles de productos": el catalogo es pequeño todavia y presumir de tamaño
   se desmiente en el primer clic, que es peor que no decir nada. Lo que si se
   puede afirmar es como funciona, y eso es lo que se cuenta. */

/* ---------------------------------------------------------------- Hero --- */

export const HomeHero = () => {
  const router = useRouter();
  const [term, setTerm] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = term.trim();
    router.push(query ? `/catalog?search=${encodeURIComponent(query)}` : '/catalog');
  };

  return (
    <section className='home-hero'>
      <div className='container-fluid-lg'>
        <div className='home-hero-inner'>
          <span className='home-hero-eyebrow'>
            <Shield size={14} />
            Proveedores verificados por Suminia
          </span>

          <h1>
            Medicamentos e insumos médicos,
            <br />
            con los datos del INVIMA a la vista
          </h1>

          <p>
            Compara la oferta de varios proveedores sobre una misma ficha, con la
            composición y el registro sanitario que constan en el listado oficial.
          </p>

          {/* El buscador va en el hero y no en un menu: en un catalogo es lo
              primero que hace quien llega, y esconderlo obliga a navegar
              categorias para llegar a algo que ya se sabe que se quiere. */}
          <form className='home-hero-search' onSubmit={submit} role='search'>
            <Search size={18} />
            <input
              type='search'
              className='form-control'
              placeholder='Busca por nombre, principio activo, registro sanitario o CUM'
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              aria-label='Buscar en el catálogo'
            />
            <button type='submit' className='btn btn-primary rounded-1'>
              Buscar
            </button>
          </form>

          <div className='home-hero-links'>
            <Link href='/catalog'>Ver todo el catálogo</Link>
            <span aria-hidden='true'>·</span>
            <Link href='/register'>Registrar mi empresa</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

/* --------------------------------------------------------- Como funciona --- */

const STEPS = [
  {
    title: 'Registra tu empresa',
    text: 'Suminia verifica los datos y habilita la cuenta. Hasta entonces puedes navegar el catálogo, pero no ver precios.',
  },
  {
    title: 'Busca como pides',
    text: 'Por principio activo, concentración, registro sanitario o CUM, no solo por marca comercial.',
  },
  {
    title: 'Compara sobre una misma ficha',
    text: 'El mismo medicamento de varios proveedores queda junto, con su precio por volumen y su pedido mínimo.',
  },
];

export const HomeSteps = () => (
  <section className='home-steps'>
    <div className='container-fluid-lg'>
      <div className='box-head'>
        <h3>Cómo funciona</h3>
      </div>

      <div className='home-steps-grid'>
        {STEPS.map((step, index) => (
          <div className='home-step' key={step.title}>
            <span className='home-step-number'>{index + 1}</span>
            <h4>{step.title}</h4>
            <p className='font-light'>{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------- Para proveedores --- */

export const HomeForSuppliers = () => (
  <section className='home-suppliers'>
    <div className='container-fluid-lg'>
      <div className='home-suppliers-inner'>
        <Briefcase size={26} />
        <div>
          <h3>¿Vendes medicamentos o insumos médicos?</h3>
          <p className='font-light'>
            Publica tu catálogo y llega a instituciones que hoy te buscan por
            teléfono. Los medicamentos se eligen del listado del INVIMA, así que
            no tienes que redactar fichas.
          </p>
        </div>
        <Link href='/register' className='btn btn-primary rounded-1'>
          Registrarme como proveedor
          <ArrowRight size={15} className='ms-1' />
        </Link>
      </div>
    </div>
  </section>
);
