import Img from '@/Components/Element/Images';
import { CommonPath } from '@/Constant';
import { Col, Row } from 'reactstrap';

const ImageDatas = () => {
  const imgData = ['fashion/1.jpg', 'fashion/2.jpg', 'fashion/3.jpg', 'fashion/4.jpg'];
  return (
    <Col md='6'>
      <div className='ratio_portrait'>
        <Row className='g-sm-3 g-2'>
          {imgData.map((src, i) => {
            return (
              <Col xs='6' key={i}>
                <div>
                  <Img src={`${CommonPath}/${src}`} className='img-fluid bg-img' alt='front' />
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </Col>
  );
};

export default ImageDatas;
