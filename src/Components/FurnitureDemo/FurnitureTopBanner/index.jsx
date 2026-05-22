import { Container, Row } from "reactstrap";
import TopBannerCard from "./TopBannerCard";
const FurnitureTopBanner = ({ bannerData }) => {
  return (
    <section className="banner-section pt-4">
      <div>
        <Container fluid={true}>
          <Row className="g-3">
            <TopBannerCard bannerData={bannerData} />
          </Row>
        </Container>
      </div>
    </section>
  );
};
export default FurnitureTopBanner;
