import { useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Btn } from '../../AbstractElements';
import FilterButton from '../ShopCanvasFilter/FilterButton';
import FilterContent from '../ShopCanvasFilter/FilterContent';
import ShopBannerDetails from '../ShopCanvasFilter/ShopBannerDetails';
import SidebarFilter from '../ShopLeftSidebarContain/SidebarFilter';
import AllProductInfinite from './AllProductInfinite';

const ShopListInfiniteContain = ({ productData, listGrid }) => {
    const [num, setNum] = useState(9);
    return (
        <section className='section-b-space'>
            <Container>
                <Row>
                    <SidebarFilter productData={productData} />
                    <Col lg='9' xs='12' className='ratio_30'>
                        <ShopBannerDetails />
                        <FilterButton customClass={'filter-button mb-3'} />
                        <FilterContent listGrid={listGrid} />
                        <AllProductInfinite productData={productData} num={num} />
                        <div className="load-more">
                            <Btn attrBtn={{ className: 'loadMore btn btn-submit btn-full', onClick: () => setNum(num + 6) }}> load more</Btn>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section >
    );
};
export default ShopListInfiniteContain;