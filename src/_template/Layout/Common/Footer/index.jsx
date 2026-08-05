import { Container, Row } from 'reactstrap';
import MainFooter from './MainFooter';
import SubFooter from './SubFooter';
import RightFooter from './SubFooter/RightFooter';

const Footers = ({ QuestionTab }) => {
  return (
    <>
      <footer className='footer-sm-space'>
        <div className='main-footer'>
          <MainFooter QuestionTab={QuestionTab} />
        </div>
        <div className='sub-footer'>
          <Container>
            <Row className='gy-3'>
              <SubFooter />
              <RightFooter />
            </Row>
          </Container>
        </div>
      </footer>
    </>
  );
};
export default Footers;
