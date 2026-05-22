import { Col } from "reactstrap";
import { Categories, OurTop, Top } from "@/Constant";
const OurCategoryTop = () => {
  return (
    <Col lg="3" className="col-xxl-2">
      <div className="category-wrap category-padding category-block theme-bg-color">
        <div>
          <h2 className="light-text">{Top}</h2>
          <h2 className="top-spacing">{OurTop}</h2>
          <span>{Categories}</span>
        </div>
      </div>
    </Col>
  );
};
export default OurCategoryTop;
