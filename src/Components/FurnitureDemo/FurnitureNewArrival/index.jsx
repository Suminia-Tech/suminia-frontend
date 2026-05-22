import { Col, Container, Row } from "reactstrap";
import { NewArrival, OurCollection } from "@/Constant";
import SectionHeader from "../../Element/SectionHeader";
import ProductCard from "./ProductCard";
const FurnitureNewArrival = ({ productData }) => {
  return (
    <section className="ratio_asos overflow-hidden">
      <Container className="p-sm-0">
        <Row className="m-0">
          <Col xs="12" className="p-0">
            <SectionHeader title={NewArrival} subTitle={OurCollection} />
          </Col>
        </Row>
        <Row className="g-sm-4 g-3">
          <ProductCard productData={productData} />
        </Row>
      </Container>
    </section>
  );
};
export default FurnitureNewArrival;
