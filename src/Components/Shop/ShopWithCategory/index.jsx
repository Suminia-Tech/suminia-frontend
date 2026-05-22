import { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import useFilter from '@/Utils/useFilter';
import PaginationComp from '../../Element/Pagination';
import AllProducts from '../ShopCanvasFilter/AllProducts';
import FilterButton from '../ShopCanvasFilter/FilterButton';
import FilterContent from '../ShopCanvasFilter/FilterContent';
import SidebarFilter from '../ShopLeftSidebarContain/SidebarFilter';
import CategoryContain from './CategoryContain';

const ShopWithCategoryContain = ({ productData }) => {
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
    <section className='section-b-space'>
      <Container>
        <Row>
          <SidebarFilter productData={productData} />
          <Col lg='9' xs='12' className='ratio_30'>
            <CategoryContain />
            <FilterButton customClass={'filter-button mb-3'} />
            <FilterContent />
            <AllProducts currentData={currentData} />
            <PaginationComp dataPerPage={dataPerPage} StoreProductLength={StoreProducts?.length} currentPage={currentPage} paginate={paginate} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ShopWithCategoryContain;
