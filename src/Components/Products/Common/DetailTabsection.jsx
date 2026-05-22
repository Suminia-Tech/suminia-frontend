import { useCallback, useState } from "react";
import { Col, TabContent, TabPane } from "reactstrap";
import DescriptionDetails from "./DescriptionDetails";
import NavSection from "./NavSection";
import QA_Details from "./Q&A_Details";
import ReviewDetails from "./ReviewDetails";
import SizeGuideDetails from "./SizeGuideDetails";
import SpecificationDetail from "./SpecificationDetail";

const DetainTabSection = () => {
  const [active, setActive] = useState(1);
  const handleClick = useCallback((value) => {
    setActive(value);
  }, []);
  return (
    <Col xs="12">
      <div className="cloth-review">
        <NavSection active={active} handleClick={handleClick} />

        <TabContent activeTab={active} id="nav-tabContent">
          <TabPane className={`fade ${active === 1 ? "show active" : ""}`} id="desc">
            <DescriptionDetails />
          </TabPane>

          <TabPane className={`fade ${active === 2 ? "show active" : ""}`} id="speci">
            <SpecificationDetail />
          </TabPane>

          <TabPane className={`fade overflow-auto ${active === 3 ? "show active" : ""}`} id="nav-guide">
            <SizeGuideDetails />
          </TabPane>

          <TabPane className={`fade ${active === 4 ? "show active" : ""}`} id="question">
            <QA_Details />
          </TabPane>

          <TabPane className={`fade ${active === 5 ? "show active" : ""}`} id="review">
            <ReviewDetails />
          </TabPane>
        </TabContent>
      </div>
    </Col>
  );
};

export default DetainTabSection;
