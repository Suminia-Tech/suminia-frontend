import { Qty } from '@/Constant';

const QuantityProduct = ({ item }) => {
  return (
    <li>
      <div className='dark-select'>
        <select className='form-select'>
          <option>{Qty}</option>
          {item.Qty.map((el, i) => (
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
export default QuantityProduct;
