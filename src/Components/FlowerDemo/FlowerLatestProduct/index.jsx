import { Col, Container, Row } from 'reactstrap';
import { LatestProduct, OurCollection } from '@/Constant';
import SectionHeader from '@/Layout/Element/SectionHeader';
import LatestSlider from './LatestSlider';

const FlowerLatestProduct = ({ productData }) => {
    return (
        <section className="ratio_asos">
            <Container className="p-sm-0">
                <Row className="m-0">
                    <Col sm="12" className="p-0">
                        <SectionHeader title={LatestProduct} subTitle={OurCollection} />
                        <LatestSlider productData={productData} />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
export default FlowerLatestProduct;