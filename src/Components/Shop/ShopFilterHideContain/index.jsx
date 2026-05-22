import { Close, HideFilter, ShowFilter } from '@/Constant';
import { useState } from 'react';
import { ArrowLeft } from 'react-feather';
import { Col, Container, Row } from 'reactstrap';
import useFilter from '@/Utils/useFilter';
import { Btn } from '../../AbstractElements';
import PaginationComp from '../../Element/Pagination';
import AllProducts from '../ShopCanvasFilter/AllProducts';
import FilterContent from '../ShopCanvasFilter/FilterContent';
import FilterOptions from '../ShopCanvasFilter/FilterOptions';

const ShopFilterHideContain = ({ productData }) => {
  const [value, setValue] = useState(false);
  const HandleClick = () => {
    setValue(!value);
  };
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
          <Col lg='3' md='4' className={`category-side${value ? ' show' : ''}`}>
            <div className='category-option'>
              <div className='button-close mb-3'>
                <Btn attrBtn={{ className: 'btn p-0' }}>
                  <ArrowLeft />
                  {Close}
                </Btn>
              </div>
              <FilterOptions productData={productData} />
            </div>
          </Col>
          <Col xs='12' className={`category-product ratio_30 ${value ? 'col-lg-12' : 'col-lg-9'}`}>
            <div className='hide-button d-flex mb-3'>
              <Btn attrBtn={{ className: 'hide-btn' }}>
                <span className='d-lg-inline-block d-none' onClick={() => HandleClick()}>
                  {HideFilter}
                </span>
                <span className='d-lg-none d-inline-block' onClick={() => HandleClick()}>
                  {ShowFilter}
                </span>
              </Btn>
            </div>
            <FilterContent />
            <AllProducts currentData={currentData} />
            <PaginationComp dataPerPage={dataPerPage} StoreProductLength={StoreProducts?.length} currentPage={currentPage} paginate={paginate} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ShopFilterHideContain;
