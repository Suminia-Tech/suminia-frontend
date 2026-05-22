import { Comments, EmailAddress, Name, Rating, Submit } from "@/Constant";
import { Col, Form, Input, Label } from "reactstrap";
import { Btn } from "../../AbstractElements";
import CommonRating from "./CommonRating";

const AddComments = () => {
  return (
    <Col lg="8">
      <p className="d-inline-block me-2">{Rating}</p>
      <CommonRating />
      <div className="review-box">
        <Form className="row g-4">
          <Col xs="12" md="6">
            <Label className="mb-1" htmlFor="name">
              {Name}
            </Label>
            <Input type="text" className="form-control" id="name" placeholder="Enter your name" />
          </Col>

          <Col xs="12" md="6">
            <Label className="mb-1" htmlFor="id">
              {EmailAddress}
            </Label>
            <input type="email" className="form-control" id="id" placeholder="Email Address" />
          </Col>

          <Col xs="12">
            <Label className="mb-1" htmlFor="comments">
              {Comments}
            </Label>
            <textarea className="form-control" placeholder="Leave a comment here" id="comments" style={{ height: "100px" }}></textarea>
          </Col>

          <Col xs="12">
            <Btn attrBtn={{ className: "default-light-theme default-theme default-theme-2" }}>{Submit}</Btn>
          </Col>
        </Form>
      </div>
    </Col>
  );
};

export default AddComments;
