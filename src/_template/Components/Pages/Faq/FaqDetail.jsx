import { Container, Row } from "reactstrap";
import AnswerSection from "./AnswerSection";
import QuestionSection from "./QuestionSection";

const FaqDetail = () => {
  return (
    <section className="faq-details section-b-space">
      <Container>
        <Row className="g-4">
          <QuestionSection />
          <AnswerSection />
        </Row>
      </Container>
    </section>
  );
};

export default FaqDetail;
