import AdminUser from './AdminUser';
import Currency from './Currency';
import ItemCart from './ItemCart';
import SelectLanguages from './Languages';
import SearchBar from './SearchBar';
import WishList from './WishList';

const RightHeader = ({ icon }) => {
  return (
    <div className='menu-right'>
      <ul>
        <Currency />
        <SelectLanguages />
        <SearchBar />
        <AdminUser />
        <WishList icon={icon} />
        <ItemCart />
      </ul>
    </div>
  );
};
export default RightHeader;
