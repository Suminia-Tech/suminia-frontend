import { Fragment } from "react";
import { Container, Row } from "reactstrap";
import LeftBanner from "./LeftBanner";
import MiddleBanner from "./MiddleBanner";
const ElectronicTopBanner = ({ bannerData, elemclass }) => {
  const BannerFilter = bannerData?.filter((el) => el.subtype === "electronictopbanner");
  return (
    <section className={`ratio2_1 ${elemclass}`}>
      <Container>
        <Row className="gy-3">
          {BannerFilter?.map((el) => {
            return el?.banners?.map((elem, i) => {
              return (
                <Fragment key={i}>
                  {elem?.heading && <LeftBanner elem={elem} />}
                  {elem?.childtype && <MiddleBanner elem={elem} />}
                </Fragment>
              );
            });
          })}
        </Row>
      </Container>
    </section>
  );
};
export default ElectronicTopBanner;
