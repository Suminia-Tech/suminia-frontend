'use client';

import { useCatalogProducts } from '../../hooks/useCatalogProducts';
import { ProductCarousel } from './ProductCarousel';

/* Los productos que se enseñan en la portada.

   Van los ultimos publicados. No hay a quien pedirle una seleccion curada, y lo
   reciente al menos demuestra que el catalogo esta vivo.

   La ficha y el carrusel los pone `ProductCarousel`, que comparte con la
   seccion de "Explora el catalogo". Aqui solo queda la consulta, que es lo
   unico propio. */
const HOW_MANY = 12;

export const FeaturedProducts = () => {
  const { data, isLoading } = useCatalogProducts({
    page: 1,
    limit: HOW_MANY,
    sort: 'createdAt',
    sortDirection: 'desc',
  });

  const products = data?.data.data ?? [];

  /* Si no hay nada publicado la seccion no aparece: un carrusel vacio con su
     titulo se lee como que algo fallo. */
  if (isLoading || products.length === 0) return null;

  return (
    <ProductCarousel
      title='Solo Para Ti'
      subtitle='Nuestros Productos'
      products={products}
    />
  );
};

export default FeaturedProducts;
