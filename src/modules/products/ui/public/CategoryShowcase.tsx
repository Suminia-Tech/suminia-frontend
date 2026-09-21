'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useGetPublicCategoriesQuery } from '../../api/productsApi';
import { useCatalogProducts } from '../../hooks/useCatalogProducts';
import { ProductCarousel } from './ProductCarousel';

/* El segundo carrusel de la portada: el catalogo, mirado por categoria.

   Tiene la misma ficha que "Solo Para Ti" —es el mismo `ProductCarousel`— pero
   no los mismos productos, y esa era la condicion para que existiera: aquella
   seccion ya enseña los doce ultimos publicados, de modo que un carrusel de
   "novedades" habria sido la misma lista con otro titulo.

   Aqui se elige. Las fichas de "Nuestras Categorias", justo encima, llevan al
   catalogo y sacan al visitante de la portada; estas pestañas dejan asomarse a
   cada categoria sin moverse, que es lo que se hace cuando todavia no se sabe
   si el sitio tiene lo que uno busca.

   Arranca en la categoria con mas productos y no en una escrita a mano: el
   catalogo cambia, y esa siempre sera la que mejor llene el carrusel. */

const HOW_MANY = 12;

export const CategoryShowcase = () => {
  const { data: categoriesData } = useGetPublicCategoriesQuery();

  const categories = (categoriesData?.data ?? [])
    .filter((category) => category.productCount > 0)
    .sort((a, b) => b.productCount - a.productCount);

  const [elegida, setElegida] = useState<string | null>(null);
  const activa = elegida ?? categories[0]?.id ?? null;

  const { data, isLoading } = useCatalogProducts({
    page: 1,
    limit: HOW_MANY,
    sort: 'createdAt',
    sortDirection: 'desc',
    ...(activa ? { filter: { categoryId: activa } } : {}),
  });

  const products = data?.data.data ?? [];

  /* Con una sola categoria las pestañas no eligen nada, y la seccion seria el
     carrusel de arriba repetido. Igual que si no hay productos: un carrusel
     vacio bajo su titulo se lee como que algo fallo. */
  if (categories.length < 2) return null;
  if (!isLoading && products.length === 0) return null;

  const nombreActiva = categories.find((c) => c.id === activa)?.name ?? '';

  return (
    <ProductCarousel
      /* El tema capitaliza cada palabra de los `h2` de portada —de ahi "Solo
         Para Ti"—, de modo que el titulo tiene que leerse bien asi: "Explora El
         Catalogo" chirriaba por el articulo suelto en mayuscula. Y tampoco
         puede sonar a la seccion de encima: alli el titular son las categorias,
         aqui lo son los productos que hay dentro. */
      title='El Catálogo Completo'
      subtitle='Elige una categoría'
      products={products}
    >
      {/* Las pestañas van entre el titulo y las fichas, que es donde se buscan:
          debajo del titulo se leen como parte de el, y encima habrian quedado
          sueltas sobre la seccion anterior. */}
      <div className='category-tabs' role='tablist' aria-label='Categorías'>
        {categories.map((category) => (
          <button
            key={category.id}
            type='button'
            role='tab'
            aria-selected={category.id === activa}
            className={category.id === activa ? 'active' : undefined}
            onClick={() => setElegida(category.id)}
          >
            {category.name}
            <span className='category-tabs-count'>{category.productCount}</span>
          </button>
        ))}
      </div>

      {activa && (
        <p className='category-tabs-link'>
          <Link href={`/catalog?categoryId=${activa}`}>
            Ver todo en {nombreActiva}
          </Link>
        </p>
      )}
    </ProductCarousel>
  );
};

export default CategoryShowcase;
