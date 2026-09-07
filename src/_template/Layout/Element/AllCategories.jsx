'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import { Btn } from '@/_template/Components/AbstractElements';
import { Allcategories } from '@/_template/Constant';
import useWindowDimensions from '@/_template/Utils/useWindowDimensions';
import {
  CATEGORYRESPONSIVE,
  CLOSEOVERLAY,
  OVERLAY,
} from '@/_template/ReduxToolkit/Reducers/ModalReducer';
import { useGetPublicCategoriesQuery } from '@/modules/products';

import CategoryResp from './CategoryResp';

/* El desplegable de categorias de la cabecera.

   Se alimenta de las categorias reales, no del menu de ejemplo de la plantilla
   —que traia frutas y verduras en tres niveles anidados. Las nuestras son
   planas: una lista, sin submenus que no existen.

   Cada una lleva al catalogo ya filtrado, que es lo mismo que hace la parrilla
   de la portada. */
const AllCategories = ({ isCategories }) => {
  const { width } = useWindowDimensions();
  const { catergoryResponsive } = useSelector((state) => state.ModalReducer);
  const dispatch = useDispatch();

  const { data } = useGetPublicCategoriesQuery();
  const categories = (data?.data ?? []).filter(
    (category) => category.productCount > 0,
  );

  const close = () => {
    if (width < 1200) dispatch(CATEGORYRESPONSIVE());
    dispatch(CLOSEOVERLAY());
  };

  return (
    <div className='category-menu'>
      {isCategories && (
        <Btn
          attrBtn={{
            className:
              'btn-solid-default btn-spacing toggle-category d-sm-block d-none',
            onClick: () => {
              if (width < 1200) dispatch(OVERLAY());
              dispatch(CATEGORYRESPONSIVE());
            },
          }}
        >
          {Allcategories}{' '}
          <i className='fas fa-chevron-down d-xl-inline-block d-none'></i>
        </Btn>
      )}

      <div className={`category-dropdown${catergoryResponsive ? ' open' : ''}`}>
        <CategoryResp />
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/catalog?categoryId=${category.id}`} onClick={close}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllCategories;
