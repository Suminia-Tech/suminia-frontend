import { Fragment } from 'react';
import { Container, Row } from 'reactstrap';
import LeftCard from './LeftCard';
import RightCard from './RightCard';
const ElectronicDeal = ({ bannerData }) => {
  const DealFilter = bannerData?.filter((el) => el.subtype === 'electronicdeal');
  return (
    <section className='ratio2_1'>
      <Container>
        <Row className='gy-3'>
          {DealFilter?.map((elem, i) => {
            return (
              <Fragment key={i}>
                <LeftCard elem={elem} />
                <RightCard elem={elem} />
              </Fragment>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};
export default ElectronicDeal;
