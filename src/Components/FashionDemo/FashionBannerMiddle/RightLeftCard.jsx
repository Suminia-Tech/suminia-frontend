import { Row } from "reactstrap";
import LeftSideOffer from "./LeftSideOffer";
import RightSideOffer from "./RightSideOffer";

const RightLeftCard = ({ MiddleBanner }) => {
  return (
    <Row className="gy-4">
      <RightSideOffer MiddleBanner={MiddleBanner} />
      <LeftSideOffer MiddleBanner={MiddleBanner} />
    </Row>
  );
};

export default RightLeftCard;
