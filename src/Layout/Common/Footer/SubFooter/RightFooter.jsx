import { Col } from 'reactstrap';

const RightFooter = () => {
  return (
    <Col md='6'>
      <p className='mb-0 font-dark'>© {new Date().getFullYear()}, MediSupply. Todos los derechos reservados</p>
    </Col>
  );
};
export default RightFooter;
