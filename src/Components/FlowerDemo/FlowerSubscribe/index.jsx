import { Container, Row } from 'reactstrap';
import EmailButton from './EmailButton';
import SubscribeNews from './SubscribeNews';
const FlowerSubscribe = ({ addBgColor }) => {
  return (
    <section className={`subscribe-section${addBgColor ? '-light' : ''} section-b-space`}>
      <div>
        <Container>
          <Row>
            <SubscribeNews addBgColor={addBgColor} />
            <EmailButton />
          </Row>
        </Container>
      </div>
    </section>
  );
};
export default FlowerSubscribe;
