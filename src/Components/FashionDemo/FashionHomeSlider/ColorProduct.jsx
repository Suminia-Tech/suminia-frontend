import { Color } from '@/Constant';
const ColorProduct = ({ item }) => {
  return (
    <li>
      <div className='dark-select'>
        <select className='form-select'>
          <option>{Color}</option>
          {item.Color.map((el, i) => (
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
export default ColorProduct;
