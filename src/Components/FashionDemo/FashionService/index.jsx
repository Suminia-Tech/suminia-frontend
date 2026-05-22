import { CustomerService } from "@/Data/CustomerService";
import { Col, Container, Row } from "reactstrap";

const FashionService = ({ removePadding }) => {
  return (
    <section className={`service-section ${!removePadding ? "service-style-2 section-b-space" : ""}`}>
      <Container>
        <Row className="g-4 g-sm-3">
          {CustomerService.map((elem) => {
            return (
              <Col xl="3" sm="6" key={elem.id}>
                <div className="service-wrap">
                  <div className="service-icon">{elem.svg}</div>
                  <div className="service-content">
                    <h3 className="mb-2">{elem.title}</h3>
                    <span className="font-light">{elem.subtitle}</span>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};
export default FashionService;
