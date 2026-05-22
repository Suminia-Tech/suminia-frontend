import { Col, Form, Input, InputGroup, InputGroupText } from "reactstrap";
import { FooterDesp, Letstouch } from "@/Constant";
const GetTouch = () => {
  return (
    <Col xl="3" lg="4" sm="6" className="d-none d-sm-block">
      <div className="footer-newsletter">
        <h3>{Letstouch}</h3>
        <Form
          className="form-newsletter needs-validation"
          name="mc-embedded-subscribe-form"
        >
          <InputGroup className="mb-4">
            <Input type="text" placeholder="Your Email Address" />
            <InputGroupText>
              <i className="fas fa-arrow-right"></i>
            </InputGroupText>
          </InputGroup>
          <p className="font-dark mb-0">{FooterDesp}</p>
        </Form>
      </div>
    </Col>
  );
};
export default GetTouch;
