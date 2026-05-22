import { Col, Container, Row } from "reactstrap";
import { NewArrival, OurCollection } from "@/Constant";
import SectionHeader from "@/Layout/Element/SectionHeader";
import ArrivalCards from "./ArrivalCards";

const FashionNewArrival = ({ productData }) => {
  return (
    <>
      <section className="ratio_asos">
        <Container>
          <Row className="m-0">
            <Col sm="12" className="p-0">
              <SectionHeader title={NewArrival} subTitle={OurCollection} />
              <ArrivalCards productData={productData} />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};
export default FashionNewArrival;
