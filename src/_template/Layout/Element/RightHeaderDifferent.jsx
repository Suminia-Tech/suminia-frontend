import AdminUser from './AdminUser';
import Currency from './Currency';
import ItemCart from './ItemCart';
import SelectLanguages from './Languages';
import SearchBarWithBgColor from './SearchBarWithBgColor';
import WishList from './WishList';

const RightHeaderDifferent = () => {
  return (
    <div className='menu-right'>
      <ul>
        <SearchBarWithBgColor />
        <Currency />
        <SelectLanguages />
        <AdminUser />
        <WishList />
        <ItemCart />
      </ul>
    </div>
  );
};
export default RightHeaderDifferent;
