import { Choose, Country, CountryArr } from '@/Constant';
import { Col, Label } from 'reactstrap';

const CountryField = () => {
  return (
    <Col md='5'>
      <Label htmlFor='validationCustom04' className='form-label'>
        {Country}
      </Label>
      <select className='form-select custome-form-select' id='validationCustom04'>
        <option disabled>{Choose}</option>
        {CountryArr.map((elem, i) => {
          return <option key={i}>{elem}</option>;
        })}
      </select>
    </Col>
  );
};

export default CountryField;
