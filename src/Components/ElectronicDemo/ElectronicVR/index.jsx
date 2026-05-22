import { Col, Container, Row } from "reactstrap";
import { JustForYou, VRCollection } from "@/Constant";
import SectionHeader from "../../Element/SectionHeader";
import VRSliders from "./VRSlider";
const ElectronicVR = ({ productData }) => {
  const FilterVrProduct = productData.filter((el) => el.type === "electronic");
  return (
    <section className="ratio_asos">
      <Container fluid={true}>
        <Row>
          <Col>
            <SectionHeader title={VRCollection} subTitle={JustForYou} />
            <VRSliders FilterVrProduct={FilterVrProduct} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default ElectronicVR;
