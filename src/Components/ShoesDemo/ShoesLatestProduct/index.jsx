import { Col, Container, Row } from "reactstrap";
import { LatestProduct, OurCollection } from "@/Constant";
import SectionHeader from "../../Element/SectionHeader";
import SliderProductCard from "./SliderProductCard";
const ShoesLatestProduct = ({ productData }) => {
  const ShoesFilterProduct = productData.filter((el) => el.type === "shoes");
  return (
    <section className="ratio_asos">
      <Container fluid={true} className="p-sm-0">
        <Row className="m-0">
          <Col sm="12" className="p-0">
            <SectionHeader title={LatestProduct} subTitle={OurCollection} />
            <SliderProductCard ShoesFilterProduct={ShoesFilterProduct} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ShoesLatestProduct;
