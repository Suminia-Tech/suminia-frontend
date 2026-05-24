import { Col, Container, Row } from "reactstrap";
import DetainTabSection from "../Common/DetailTabsection";
import ProductDetails from "../ProductBundle/ProductDetails";
import SliderSection from "./SliderSection";

const ProductLeftThumbnailContain = ({ singleProduct }) => {
  return (
    <section style={{ paddingTop: "40px" }}>
      <Container>
        <Row className="gx-4 gy-5">
          <Col lg="12" xs="12">
            <div className="details-items">
              <Row className="g-4">
                <SliderSection singleProduct={singleProduct} />
                <Col md="6">
                  <ProductDetails singleProduct={singleProduct} />
                </Col>
              </Row>
            </div>
          </Col>
          <DetainTabSection singleProduct={singleProduct} />
        </Row>
      </Container>
    </section>
  );
};

export default ProductLeftThumbnailContain;
