import { Container, Row } from 'reactstrap';
import SectionContain from './SectionContain';
import SectionSvg from './SectionSvg';

const SectionSoon = () => {
  return (
    <section className='section-b-space'>
      <Container fluid={true}>
        <Row>
          <SectionSvg />
          <SectionContain />
        </Row>
      </Container>
    </section>
  );
};

export default SectionSoon;
