import { Fragment } from 'react';
import { Container, Row } from 'reactstrap';
import Leftside from './Leftside';
import RightSide from './RightSide';
const ShoesBannerMiddle = ({ bannerData, elemclass }) => {
  const ShoesMiddle = bannerData.filter((el) => el.subtype === 'shoesnewoffers');
  return (
    <section className={`banner-style-2 offer-banner ${elemclass}`}>
      <Container>
        <Row className='gy-4'>
          {ShoesMiddle.map((elem, i) => {
            return (
              <Fragment key={i}>
                <Leftside elem={elem} />
                <RightSide elem={elem} />
              </Fragment>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};
export default ShoesBannerMiddle;
