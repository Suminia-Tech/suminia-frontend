'use client';

import { useState } from 'react';
import { UserPlus } from 'react-feather';
import { toast } from 'react-toastify';
import { Table } from 'reactstrap';

import { extractErrorMessage } from '@/shared/lib/apiError';
import { PageHeader, Panel } from '@/shared/ui';
import { canOperate } from '@/shared/lib/organizationAccess';
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

  /* El backend bloquea el alta si la empresa no esta aprobada
     (ActiveOrganizationGuard), de modo que ofrecerla seria ofrecer un 403. */
  const isOperational = canOperate(user?.organizationStatus);
  const canCreate = hasPermission(user?.permissions, 'user:create') && isOperational;
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
      <PageHeader
        title='Mi equipo'
        description='Quién de tu empresa puede entrar a Suminia y qué puede hacer.'
        action={
          canCreate && (
            /* Un boton y no el enlace de antes: abre un formulario, no lleva a
               otra pagina, y con la cabecera compartida ya no hace falta el
               `ms-auto` que lo empujaba al extremo. */
            <button
              type='button'
              className='btn btn-primary d-inline-flex align-items-center gap-2'
              onClick={() => setFormOpen(true)}
            >
              <UserPlus size={16} />
              Añadir miembro
            </button>
          )
        }
      />

      {!isOperational && (
        <div className='alert alert-warning'>
          Tu empresa está pendiente de aprobación. Podrás incorporar personas a tu
          equipo cuando el equipo de Suminia la verifique.
        </div>
      )}

      {members.length === 0 ? (
        <Panel>
          <p className='font-light mb-0'>
            Todavía no hay nadie más en tu empresa. Añade a quien vaya a publicar
            productos o atender pedidos contigo.
          </p>
        </Panel>
      ) : (
        <Panel className='panel-table'>
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
                    {isSelf && <span className='font-light'>&nbsp;(tú)</span>}
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
        </Panel>
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
