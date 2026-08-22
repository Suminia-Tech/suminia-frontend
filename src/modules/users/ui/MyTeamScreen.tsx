'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Table } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { hasPermission } from '@/shared/lib/permissions';
import { useAppSelector } from '@/store/hooks';

import { useGetTeamQuery, useUpdateMemberMutation } from '../api/usersApi';
import {
  getTeamRoleLabel,
  getUserStatusClassName,
  getUserStatusLabel,
} from '../lib/userLabels';
import MemberFormModal from './MemberFormModal';

/* Equipo de la empresa del usuario. El backend ya devuelve solo los miembros
   de su organizacion, de modo que aqui no se filtra nada. */
export const MyTeamScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [isFormOpen, setFormOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetTeamQuery(undefined, {
    skip: !hydrated,
  });
  const [updateMember, { isLoading: isSaving }] = useUpdateMemberMutation();

  const canCreate = hasPermission(user?.permissions, 'user:create');
  const canUpdate = hasPermission(user?.permissions, 'user:update');
  const currentUserRoles = (user?.roles ?? []).map((role) =>
    typeof role === 'string' ? role : role.name,
  );

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      await updateMember({
        id,
        data: { status: isActive ? 'INACTIVE' : 'ACTIVE' },
      }).unwrap();
      toast.success(isActive ? 'Miembro desactivado' : 'Miembro reactivado');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo cambiar el estado.'));
    }
  };

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
        {canCreate && (
          <a
            href='#javascript'
            onClick={(event) => {
              event.preventDefault();
              setFormOpen(true);
            }}
          >
            Añadir miembro
          </a>
        )}
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
              {canUpdate && <th className='text-end'>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const isSelf = member.id === user?.id;
              const isActive = member.status === 'ACTIVE';

              return (
                <tr key={member.id}>
                  <td>
                    {member.name}
                    {isSelf && <span className='font-light'> (tú)</span>}
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
                  {canUpdate && (
                    <td className='text-end'>
                      {/* Nadie puede desactivarse a si mismo: si el unico
                          administrador lo hace, la empresa se queda sin quien
                          gestione el equipo. El backend tambien lo impide. */}
                      {!isSelf && (
                        <button
                          type='button'
                          className={`btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-primary'}`}
                          disabled={isSaving}
                          onClick={() => toggleStatus(member.id, isActive)}
                        >
                          {isActive ? 'Desactivar' : 'Reactivar'}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <MemberFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        currentUserRoles={currentUserRoles}
      />
    </>
  );
};

export default MyTeamScreen;
