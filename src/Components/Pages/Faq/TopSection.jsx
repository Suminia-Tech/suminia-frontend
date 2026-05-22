import Img from "@/Components/Element/Images";
import { CommonPath } from "@/Constant";
import { Col, Container, Row } from "reactstrap";
import { FaqData } from "../../../Data/FaqData";

const TopSection = () => {
  return (
    <section className="faq-section pt-0">
      <Container>
        <Row className="g-lg-5 g-4">
          {FaqData.map((elem, i) => {
            return (
              <Col md="4" className="zi-1" key={i}>
                <div className="faq-contain">
                  <div className="faq-image">
                    <Img src={`${CommonPath}/${elem.image}`} className="img-fluid" alt="faq" />
                  </div>
                  <h2>{elem.title}</h2>
                  <h5>{elem.subtitle}</h5>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default TopSection;
