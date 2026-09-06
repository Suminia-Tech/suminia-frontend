import { Container, Row } from "reactstrap";
import DetainTabSection from "../Common/DetailTabsection";
import NotificationModal from "../Common/NotificationModal";
import LeftsideContain from "./LeftsideContain";
import RightsideContain from "./RightsideContain";

const ProductLeftSidebarContain = ({ productData, id }) => {
  return (
    <>
      <section>
        <Container>
          <Row className="gx-4 gy-5">
            <LeftsideContain productData={productData} />
            <RightsideContain id={id} />
            <DetainTabSection />
          </Row>
        </Container>
      </section>
      <NotificationModal />
    </>
  );
};

export default ProductLeftSidebarContain;
