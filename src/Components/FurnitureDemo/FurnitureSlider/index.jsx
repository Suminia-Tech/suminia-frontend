import { Container, Row } from "reactstrap";
import PopularCard from "./PopularCards";
const FurnitureSlider = ({ popularCard }) => {
  return (
    <section className="product-slider overflow-hidden">
      <div>
        <Container>
          <Row className="g-3">
            <PopularCard popularCard={popularCard} />
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default FurnitureSlider;
