import useFilter from '@/Utils/useFilter';
import React, { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import PaginationComp from '../../Element/Pagination';
import AllProducts from './AllProducts';
import FilterButton from './FilterButton';
import FilterContent from './FilterContent';
import ShopBannerDetails from './ShopBannerDetails';

const ShopCanvasFilterContain = ({ productData, grid5 }) => {
  const filterProduct = useFilter(productData);
  const StoreProducts = filterProduct && filterProduct;
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const indexOfLastPost = currentPage * dataPerPage;
  const indexOfFirstPost = indexOfLastPost - dataPerPage;
  const currentData = StoreProducts && StoreProducts?.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber < currentData?.length) {
      setCurrentPage(pageNumber);
    }
  };
  return (
    <>
      <section className='section-b-space'>
        <Container>
          <Row>
            <Col lg='12' xs='12' className='ratio_30'>
              <ShopBannerDetails />
              <FilterButton />
              <FilterContent grid5={grid5} />
              <AllProducts currentData={currentData} />
              <PaginationComp dataPerPage={dataPerPage} StoreProductLength={StoreProducts?.length} currentPage={currentPage} paginate={paginate} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ShopCanvasFilterContain;
