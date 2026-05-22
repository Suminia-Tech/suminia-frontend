import { Col } from 'reactstrap';
import { CopyRight } from '@/Constant';

const RightFooter = () => {
  return (
    <Col md='6'>
      <p className='mb-0 font-dark'>{CopyRight}</p>
    </Col>
  );
};
export default RightFooter;
