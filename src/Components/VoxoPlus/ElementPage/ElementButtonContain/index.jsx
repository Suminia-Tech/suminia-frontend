import { ElementButton } from "@/Constant";
import { Col, Container, Row } from "reactstrap";
import ElementHeader from "../../../Element/ElementHeader";
import BootstrapButton from "./BootstrapButton";
import ButtonBlock from "./ButtonBlock";
import ButtonGroup from "./ButtonGroup";
import ButtonOutline from "./ButtonOutline";
import ButtontextSize from "./ButtontextSize";
import ThemeBtn from "./ThemeBtn";

const ElementButtonContain = () => {
  return (
    <section className="section-b-space overflow-hidden">
      <Container>
        <Row className="g-18">
          <Col xs="12">
            <ElementHeader customeclass={"title title1 text-center"} title={ElementButton} />
          </Col>
          <ThemeBtn />
          <ButtontextSize />
          <BootstrapButton />
          <ButtonOutline />
          <ButtonBlock />
          <ButtonGroup />
        </Row>
      </Container>
    </section>
  );
};

export default ElementButtonContain;
