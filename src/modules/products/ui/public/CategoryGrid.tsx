'use client';

import Link from 'next/link';

import { useGetPublicCategoriesQuery } from '../../api/productsApi';

/* Las categorias del catalogo, como puertas de entrada.

   Son las de verdad, las mismas por las que se filtra: si se listaran a mano
   aqui, en cuanto Suminia añadiera una, la portada se quedaria vieja sin que
   nadie lo notara.

   Quien llega sabiendo lo que busca usa el buscador; esto es para quien llega a
   ver que hay, que en un catalogo nuevo es casi todo el mundo. */
export const CategoryGrid = () => {
  const { data, isLoading } = useGetPublicCategoriesQuery();
  const categories = data?.data ?? [];

  if (isLoading || categories.length === 0) return null;

  return (
    <section className='home-categories'>
      <div className='container-fluid-lg'>
        <div className='box-head'>
          <h3>Explora por categoría</h3>
        </div>

        <div className='home-categories-grid'>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog?categoryId=${category.id}`}
              className='home-category'
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
