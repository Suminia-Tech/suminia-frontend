import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import PaginationComp from '../../Element/Pagination';

const PaginationSection = ({ dataPerPage, StoreProductLength, currentPage, paginate }) => {
  return (
    <section className='section-b-space'>
      <Container>
        <Row>
          <Col xs='12'>
            <PaginationComp dataPerPage={dataPerPage} StoreProductLength={StoreProductLength?.length} currentPage={currentPage} paginate={paginate} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default PaginationSection;
