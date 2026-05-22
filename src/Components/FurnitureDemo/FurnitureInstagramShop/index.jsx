import { Col, Container, Row } from "reactstrap";
import { InstagramShop, NewCollection } from "@/Constant";
import SectionHeader from "../../Element/SectionHeader";
import InstaShopCards from "./InstaShopCards";
const FurnitureInstagramShop = ({ bannerData }) => {
  const InstaShopFilter = bannerData.filter((el) => el.subtype === "furnitureinstashop");
  return (
    <section>
      <Container fluid={true}>
        <Row>
          <Col>
            <SectionHeader title={InstagramShop} subTitle={NewCollection} />
            <InstaShopCards InstaShopFilter={InstaShopFilter} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};
export default FurnitureInstagramShop;
