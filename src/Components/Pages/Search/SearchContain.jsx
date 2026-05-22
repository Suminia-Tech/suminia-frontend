import { SearchForProducts } from '@/Constant';
import { Col, Container, Input, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';

const SearchContain = () => {
  return (
    <section className='search-section'>
      <Container>
        <Row>
          <Col xs='12'>
            <div className='title title1 text-center'>
              <h2>{SearchForProducts}</h2>
            </div>
          </Col>
          <Col lg='6' md='8' className='mx-auto'>
            <div className='search-bar'>
              <div className='input-group search-bar w-100 m-0'>
                <Input type='search' className='form-control' placeholder='Search' />
                <Btn attrBtn={{ className: 'input-group-text', id: 'basic-addon3' }}>
                  <i className='fas fa-search'></i>
                </Btn>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SearchContain;
