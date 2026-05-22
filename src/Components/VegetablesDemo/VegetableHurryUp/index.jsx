import { HurryUp, SpecialOffer } from '@/Constant';
import { Fragment } from 'react';
import { Col, Container, Row, TabContent } from 'reactstrap';
import SectionHeader from '../../Element/SectionHeader';
import LeftTab from './LeftTab';
import MiddleTab from './MiddleTab';
import RightTab from './RightTab';
const VegetableHurryUp = ({ bannerData }) => {
  const HurryUpFilter = bannerData.filter((el) => el.subtype === 'vegetableshurryup');
  return (
    <section className='tab-section'>
      <Container>
        <Row>
          <Col>
            <SectionHeader title={HurryUp} subTitle={SpecialOffer} />
            <div className='tab-wrap'>
              <TabContent>
                <div className='offer-wrap product-style-1'>
                  <Row className='g-xl-4 g-3'>
                    {HurryUpFilter.map((el) => {
                      return el.banners.map((elem, i) => {
                        return (
                          <Fragment key={i}>
                            <LeftTab elem={elem} />
                            <MiddleTab elem={elem} />
                            <RightTab elem={elem} />
                          </Fragment>
                        );
                      });
                    })}
                  </Row>
                </div>
              </TabContent>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default VegetableHurryUp;
