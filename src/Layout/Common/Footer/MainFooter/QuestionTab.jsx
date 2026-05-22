import { CommonPath, FooterDespp, GotQustion, mobileno } from '@/Constant';
import Image from 'next/image';
import { Col } from 'reactstrap';
const QuestionTabs = () => {
  return (
    <Col xl='3' lg='4' sm='6' className='d-none d-sm-block'>
      <div className='footer-newsletter'>
        <h3>{GotQustion}</h3>
        <div className='footer-number'>
          <div className='footer-number-image'>
            <Image width={20} height={20} src={`${CommonPath}/shoes/other/headphone.png`} className='img-fluid' alt='headphone' />
          </div>

          <div className='footer-number-container'>
            <h3>{mobileno}</h3>
          </div>
        </div>

        <div className='footer-details'>
          <p className='font-light'>{FooterDespp}</p>
        </div>
      </div>
    </Col>
  );
};
export default QuestionTabs;
