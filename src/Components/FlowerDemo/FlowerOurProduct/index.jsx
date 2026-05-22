import { Col, Container, Row } from "reactstrap";
import { JustForYou, OurProduct } from "@/Constant";
import FlowerProductRight from "./FlowerProductRight";
import MostPopular from "./MostPopular";
import SectionHeader from "@/Layout/Element/SectionHeader";

const FlowerOurProduct = ({ productData }) => {
  return (
    <section>
      <Container>
        <Row className="gy-lg-0 gy-5">
          <Col lg="8">
            <SectionHeader title={OurProduct} subTitle={JustForYou} />
            <FlowerProductRight productData={productData} />
          </Col>
          <MostPopular productData={productData} />
        </Row>
      </Container>
    </section>
  );
};
export default FlowerOurProduct;
