import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import BoxAnimationSection from "./BoxAnimationSection";

const BreadCrumb = (props) => {
  const { parent = "", title = "" } = props;
  return (
    <section className="breadcrumb-section section-b-space">
      <BoxAnimationSection />
      <Container>
        <Row>
          <Col xs="12">
            <h3>{title}</h3>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href={"/"}>
                    <i className="fas fa-home"></i>
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {parent}
                </li>
              </ol>
            </nav>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BreadCrumb;
