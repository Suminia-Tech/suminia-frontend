import { Howhelp } from "@/Constant";
import { Col, Container, Input, Row } from "reactstrap";
import { Btn } from "../../AbstractElements";
import BoxAnimationSection from "../../Element/BreadCrumb/BoxAnimationSection";

const BreadcrumSection = () => {
  return (
    <section className="breadcrumb-section section-b-space">
      <BoxAnimationSection />
      <Container>
        <Row>
          <Col xs="12" className="search-section search-section-2">
            <h3>{Howhelp}</h3>
            <div className="search-bar">
              <div className="input-group search-bar">
                <Input type="search" className="form-control" placeholder="Search" />
                <Btn attrBtn={{ className: "input-group-text", id: "basic-addon3" }}>
                  <i className="fas fa-search"></i>
                </Btn>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BreadcrumSection;
