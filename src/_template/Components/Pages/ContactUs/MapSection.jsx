import { Col, Container, Row } from 'reactstrap';

const MapSection = () => {
  return (
    <section className='contact-section'>
      <Container fluid={true}>
        <Row className='gy-4'>
          <Col xs='12' className='p-0'>
            <div className='location-map'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7227.225249699896!2d55.17263937326456!3d25.081115462415855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sin!4v1632538854272!5m2!1sen!2sin'
                loading='lazy'></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default MapSection;
