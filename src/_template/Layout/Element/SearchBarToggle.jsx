'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'react-feather';

/* El buscador que se despliega en pantallas pequeñas. Como el de la cabecera,
   lleva al catalogo real en vez de filtrar un JSON estatico. */
const SearchBarToggle = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const query = term.trim();
    setOpen(false);
    router.push(query ? `/catalog?search=${encodeURIComponent(query)}` : '/catalog');
  };

  return (
    <li className='right-nav-list'>
      <button
        type='button'
        className='btn p-0 border-0 bg-transparent'
        onClick={() => setOpen(!open)}
        aria-label='Buscar'
      >
        <Search />
      </button>

      {open && (
        <form className='search-full show' onSubmit={submit} role='search'>
          <div className='input-group'>
            <span className='input-group-text'>
              <Search className='font-light' />
            </span>
            <input
              type='search'
              className='form-control search-type'
              placeholder='Buscar un medicamento o insumo'
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              autoFocus
            />
          </div>
        </form>
      )}
    </li>
  );
};

export default SearchBarToggle;
