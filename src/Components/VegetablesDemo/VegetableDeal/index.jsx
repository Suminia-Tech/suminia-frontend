import { Fragment } from "react";
import { Container, Row } from "reactstrap";
import LeftSideDeal from "./LeftSideDeal";
import RightSideDeal from "./RightSideDeal";

const VegetableDeal = ({ bannerData, elemclass }) => {
  const VegetableFilter = bannerData.filter((el) => el.subtype === "vegetablesdeal");
  return (
    <section className={`ratio2_1 section-b-space ${elemclass}`}>
      <Container>
        <Row className="gy-3">
          {VegetableFilter.map((elem, i) => {
            return (
              <Fragment key={i}>
                <LeftSideDeal elem={elem} />
                <RightSideDeal elem={elem} />
              </Fragment>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};
export default VegetableDeal;
