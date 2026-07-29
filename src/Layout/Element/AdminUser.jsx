'use client';

import Link from 'next/link';
import { User } from 'react-feather';
import { Logins, Registers } from '@/Constant';
import { useAuth } from '@/hooks/useAuth';
import { LOGINMODAL } from '@/ReduxToolkit/Reducers/ModalReducer';
import { useDispatch } from 'react-redux';

const AdminUser = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch();

  return (
    <li className='onhover-dropdown account-dropbox'>
      <div className='cart-media'>
        <User />
      </div>
      <div className='onhover-div profile-dropdown'>
        <ul>
          {isAuthenticated ? (
            <>
              <li className='d-block fw-bold'>{user?.name}</li>
              <li>
                <Link href={'/page/user_dashboard'} className='d-block'>
                  Mi cuenta
                </Link>
              </li>
              <li onClick={logout} className='d-block' style={{ cursor: 'pointer' }}>
                Cerrar sesión
              </li>
            </>
          ) : (
            <>
              <li onClick={() => dispatch(LOGINMODAL())} className='d-block' style={{ cursor: 'pointer' }}>
                {Logins}
              </li>
              <li>
                <Link href={'/page/register'} className='d-block'>
                  {Registers}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </li>
  );
};
export default AdminUser;
