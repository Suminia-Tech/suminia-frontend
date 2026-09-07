'use client';

import Link from 'next/link';

import { useGetPublicCategoriesQuery } from '../../api/productsApi';

/* Las categorias del catalogo, como puertas de entrada a la portada.

   Son las de verdad, las mismas por las que se filtra: si se listaran a mano
   aqui, en cuanto Suminia añadiera una la portada se quedaria vieja sin que
   nadie lo notara.

   Cada una dice cuantos productos tiene. No es adorno: entrar en una categoria
   y encontrarla vacia es la clase de cosa que se paga en confianza, y ese
   numero lo evita antes del clic. Por eso cuenta solo lo publicado por empresas
   habilitadas, que es lo que el visitante va a encontrar.

   Sin ilustraciones: no hay dibujos propios por categoria y poner el mismo
   icono generico en las siete no informa de nada. */
export const CategoryGrid = () => {
  const { data, isLoading } = useGetPublicCategoriesQuery();
  const categories = (data?.data ?? []).filter(
    (category) => category.productCount > 0,
  );

  if (isLoading || categories.length === 0) return null;

  return (
    <section className='home-categories'>
      <div className='container-fluid-lg'>
        <div className='box-head'>
          <h3>Comprar por categoría</h3>
        </div>

        <div className='home-categories-grid'>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog?categoryId=${category.id}`}
              className='home-category'
            >
              <span className='home-category-name'>{category.name}</span>
              <span className='home-category-count'>
                {category.productCount === 1
                  ? '1 producto'
                  : `${category.productCount} productos`}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
