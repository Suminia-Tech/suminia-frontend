import Link from 'next/link';
import { Col, Container, Row } from 'reactstrap';
import { BackHomePage, CommonPath, pagedescription, pagenotfound } from '@/Constant';
import Img from '@/Components/Element/Images';

const SectionSvg = () => {
  return (
    <section className='page-not-found section-b-space'>
      <Container>
        <Row className='gx-md-2 gx-0 gy-md-0 gy-3'>
          <Col md='8' className='m-auto'>
            <div className='page-image'>
              <Img src={`${CommonPath}/inner-page/404.png`} className='img-fluid' alt='no page found' />
            </div>
          </Col>

          <Col md='8' className='mx-auto mt-md-5 mt-3'>
            <div className='page-container pass-forgot'>
              <div>
                <h2>{pagenotfound}</h2>
                <p>{pagedescription}</p>
                <Link href={'/'} className='btn btn-solid-default fw-bold'>
                  {BackHomePage}
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SectionSvg;
