import { HeaderStyle1, HeaderStyle2, HeaderStyle3, HeaderStyle4, HeaderStyle5 } from '@/Constant';
import { Col, Container, Row } from 'reactstrap';
import Header1 from '../../../../Layout/Common/Header/Header1';
import Header2 from '../../../../Layout/Common/Header/Header2';
import Header3 from '../../../../Layout/Common/Header/Header3';
import Header4 from '../../../../Layout/Common/Header/Header4';
import Header5 from '../../../../Layout/Common/Header/Header5';

const ElementHeaderContain = () => {
  const noStyle = true;
  return (
    <section className='section-b-space'>
      <Container fluid={true}>
        <Row className='gy-3'>
          <Col xs='12'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>{HeaderStyle1}</h2>
              </div>

              <div className='contain-image-box'>
                <Header1 noStyle={noStyle} />
              </div>
            </div>
          </Col>

          <Col xs='12'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>{HeaderStyle2}</h2>
              </div>

              <div className='contain-image-box'>
                <Header2 noStyle={noStyle} />
              </div>
            </div>
          </Col>

          <Col xs='12'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>{HeaderStyle3}</h2>
              </div>

              <div className='contain-image-box'>
                <Header3 noStyle={noStyle} />
              </div>
            </div>
          </Col>

          <Col xs='12'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>{HeaderStyle4}</h2>
              </div>

              <div className='contain-image-box'>
                <Header4 noStyle={noStyle} />
              </div>
            </div>
          </Col>

          <Col xs='12'>
            <div className='header-image-contain'>
              <div className='title title1 text-center'>
                <h2>{HeaderStyle5}</h2>
              </div>
              <div className='contain-image-box'>
                <Header5 noStyle={noStyle} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ElementHeaderContain;
