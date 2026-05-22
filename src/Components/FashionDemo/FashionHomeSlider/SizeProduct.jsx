import { Size } from '@/Constant';

const SizeProduct = ({ item }) => {
  return (
    <li>
      <div className='dark-select'>
        <select className='form-select'>
          <option>{Size}</option>
          {item.Size.map((el, i) => (
            <option key={i} value={i}>
              {el}
            </option>
          ))}
        </select>
        <i className='fas fa-chevron-down'></i>
      </div>
    </li>
  );
};
export default SizeProduct;
