'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'react-feather';
import { Input } from 'reactstrap';

/* Buscador de la cabecera publica.

   Antes se traia el catalogo entero de un JSON estatico y filtraba en el
   navegador, con sugerencias sacadas de productos inventados. Ahora lleva al
   catalogo real, que es quien sabe buscar —por nombre, principio activo,
   registro sanitario o CUM— y que ademas pagina.

   No sugiere mientras se escribe: hacerlo bien pide un endpoint publico de
   sugerencias que hoy no existe, y fingirlo con datos falsos es lo que se
   estaba quitando. */
const SearchForVegitable = () => {
  const router = useRouter();
  const [term, setTerm] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const query = term.trim();
    router.push(query ? `/catalog?search=${encodeURIComponent(query)}` : '/catalog');
  };

  return (
    <form
      className='search-box1 d-lg-flex d-none align-items-center'
      style={{ width: '70%', marginLeft: '24px' }}
      onSubmit={submit}
      role='search'
    >
      <div
        className='the-basics input-group'
        style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
      >
        <Input
          type='search'
          className='form-control typeahead'
          placeholder='Buscar un medicamento o insumo'
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          style={{ borderRadius: '0.5rem 0 0 0.5rem', borderRight: 'none' }}
        />
        <button
          type='submit'
          className='input-group-text close-search theme-bg-color search-box'
          style={{ borderRadius: '0 0.5rem 0.5rem 0', border: 0 }}
          aria-label='Buscar'
        >
          <Search />
        </button>
      </div>
    </form>
  );
};

export default SearchForVegitable;
