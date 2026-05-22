import Link from 'next/link';
import { User } from 'react-feather';
import { Logins, Registers } from '@/Constant';
import { firebase_app } from '../../Config/firebase';
import { useRouter } from 'next/navigation';

const AdminUser = () => {
  const router = useRouter();
  const firebaseLogout = () => {
    firebase_app.auth().signOut();
    router.push('/page/login');
  };
  return (
    <li className='onhover-dropdown account-dropbox'>
      <div className='cart-media'>
        <User />
      </div>
      <div className='onhover-div profile-dropdown'>
        <ul>
          <li>
            <Link href={'/page/login'} className='d-block'>
              {Logins}
            </Link>
          </li>
          <li>
            <Link href={'/page/register'} className='d-block'>
              {Registers}
            </Link>
          </li>
          <li onClick={() => firebaseLogout()} className='d-block'>
            {'Logout'}
          </li>
        </ul>
      </div>
    </li>
  );
};
export default AdminUser;
