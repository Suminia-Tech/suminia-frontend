'use client';

import { Table } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { useAppSelector } from '@/store/hooks';

import { useGetTeamQuery } from '../api/usersApi';
import {
  getTeamRoleLabel,
  getUserStatusClassName,
  getUserStatusLabel,
} from '../lib/userLabels';

/* Equipo de la empresa del usuario. El backend ya devuelve solo los miembros
   de su organizacion, de modo que aqui no se filtra nada. */
export const MyTeamScreen = () => {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  const { data, isLoading, isError, error } = useGetTeamQuery(undefined, {
    skip: !hydrated,
  });

  if (!hydrated || isLoading) {
    return <p className='font-light'>Cargando...</p>;
  }

  if (isError) {
    return (
      <div className='alert alert-danger'>
        {extractErrorMessage(error, 'No se pudo cargar el equipo.')}
      </div>
    );
  }

  const members = data?.data.data ?? [];

  return (
    <>
      <div className='box-head'>
        <h3>Mi equipo</h3>
      </div>

      {members.length === 0 ? (
        <p className='font-light'>Todavía no hay nadie más en tu empresa.</p>
      ) : (
        <Table responsive className='align-middle'>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  {member.name}
                  {member.id === currentUserId && (
                    <span className='font-light'> (tú)</span>
                  )}
                </td>
                <td>{member.email}</td>
                <td>{getTeamRoleLabel(member.roles)}</td>
                <td>
                  <span className={`badge ${getUserStatusClassName(member.status)}`}>
                    {getUserStatusLabel(member.status)}
                  </span>
                  {!member.emailVerifiedAt && (
                    <span className='font-light d-block'>Correo sin verificar</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default MyTeamScreen;
