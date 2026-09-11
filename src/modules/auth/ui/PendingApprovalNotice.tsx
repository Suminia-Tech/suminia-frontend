'use client';

import { Clock } from 'react-feather';

import { useAppSelector } from '@/store/hooks';

/* El aviso de que la empresa todavia esta en revision.

   Sin el, quien entra con una cuenta recien registrada ve la tienda igual que
   un visitante y no entiende por que no hay precios: la regla existe, pero no
   se la cuenta nadie. Es la diferencia entre una espera y un fallo.

   Se le deja navegar el catalogo mientras tanto —buscar, abrir fichas, ver que
   formatos hay— porque es lo que sostiene el interes hasta que se apruebe.
   Precios no ve: eso no lo decide esta franja sino el backend, que sencillamente
   no los manda.

   Aparece en cualquier pagina publica, de modo que no depende de por donde
   entre. */
export const PendingApprovalNotice = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  /* Solo a quien pertenece a una empresa sin aprobar. El personal de Suminia no
     tiene empresa, y quien ya esta aprobado no necesita que se lo recuerden. */
  if (!hydrated || !isAuthenticated) return null;
  if (!user?.organizationId) return null;
  if (user.organizationStatus === 'ACTIVE') return null;

  const rechazada = user.organizationStatus === 'REJECTED';
  const suspendida = user.organizationStatus === 'SUSPENDED';

  return (
    <div className='pending-notice'>
      <div className='container-fluid-lg'>
        <Clock size={16} />
        <p>
          {rechazada ? (
            <>
              <strong>Tu solicitud no fue aprobada.</strong> Escríbenos si crees
              que se trata de un error y la revisamos.
            </>
          ) : suspendida ? (
            <>
              <strong>Tu cuenta está suspendida.</strong> Mientras tanto puedes
              navegar el catálogo, pero no ver precios ni comprar.
            </>
          ) : (
            <>
              <strong>Estamos verificando tu empresa.</strong> Puedes navegar el
              catálogo mientras tanto; los precios aparecerán en cuanto quede
              aprobada.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default PendingApprovalNotice;
