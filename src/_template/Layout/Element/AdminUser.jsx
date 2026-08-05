'use client';

import Link from 'next/link';
import { User } from 'react-feather';
import { Logins, Registers } from '@/_template/Constant';
import { useAuth } from '@/modules/auth';
import { getAccountLabel } from '@/modules/auth';
import { LOGINMODAL } from '@/_template/ReduxToolkit/Reducers/ModalReducer';
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
                  {getAccountLabel(user)}
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
                <Link href={'/register'} className='d-block'>
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
