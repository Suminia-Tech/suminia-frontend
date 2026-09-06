import { Col } from "reactstrap";
import { FaqQuestionAnswer } from "../../../Data/FaqData";

const QuestionSection = () => {
  return (
    <Col md="4">
      <div className="faq-link-box">
        <ul>
          {FaqQuestionAnswer.map((elem) => {
            return (
              <li key={elem.id}>
                <a href={`#${elem.id}`}>
                  <h4>{elem.id}.</h4>
                  <h5>{elem.title}</h5>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </Col>
  );
};

export default QuestionSection;
