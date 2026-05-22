import { NoProduct, loadmore } from '@/Constant';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import LeftSidebar from '../BlogDetails/LeftSidebar';
import ProductCard from './ProductCard';

const BlogInfiniteScroll = () => {
  const { blogdata } = useSelector((state) => state.BlogReducer);
  const InfiniteFilter = blogdata.filter((el) => el.type === 'blogcard');
  const [num, setNum] = useState(6);
  const HandleClick = (e) => {
    e.preventDefault();
    setNum(num + 3);
  };
  return (
    <section id='portfolio' className='left-sidebar-section masonary-blog-section section-b-space'>
      <Container>
        <Row className='g-4'>
          <Col lg='9' md='7' className='order-md-1 ratio3_2'>
            <Row className='g-4 product-load-more'>
              <ProductCard InfiniteFilter={InfiniteFilter} num={num} />
            </Row>
            <div className='load-more' onClick={(e) => HandleClick(e)}>
              <Btn attrBtn={{ className: 'loadMore btn-submit btn-full' }}>{num > InfiniteFilter[0]?.blogs?.length ? NoProduct : loadmore}</Btn>
            </div>
          </Col>
          <LeftSidebar />
        </Row>
      </Container>
    </section>
  );
};

export default BlogInfiniteScroll;
