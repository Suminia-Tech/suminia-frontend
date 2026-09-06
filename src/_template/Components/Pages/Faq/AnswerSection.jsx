import { HelpCircle } from "react-feather";
import { Col } from "reactstrap";
import { FaqQuestionAnswer } from "../../../Data/FaqData";

const AnswerSection = () => {
  return (
    <Col lg="7" md="8">
      {FaqQuestionAnswer.map((elem) => {
        return (
          <div className="faq-heading" id={elem.id} key={elem.id}>
            <HelpCircle className="theme-color" />
            <div className="faq-option">
              <h3>{elem.title}</h3>
              <h6 className="font-light">{elem.answer}</h6>
            </div>
          </div>
        );
      })}
    </Col>
  );
};

export default AnswerSection;
