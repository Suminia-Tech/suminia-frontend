import { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import { getAPIData } from "../../../../Utils";
import Banner1 from "./Banner1";
import Banner2 from "./Banner2";
import Banner3 from "./Banner3";
import Banner4 from "./Banner4";
import Banner5 from "./Banner5";
import Banner6 from "./Banner6";
import Banner7 from "./Banner7";

const ElementCollectionContain = () => {
  const [bannerData, setBannerData] = useState([]);
  useEffect(() => {
    const types = ["banner"];
    types.map((type) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "banner" && setBannerData(res?.data);
      });
    });
  }, []);
  return (
    <section className="section-b-space">
      <Container fluid={true}>
        <Row className="g-4">
          <Banner1 bannerData={bannerData} />

          <Banner2 bannerData={bannerData} />

          <Banner3 bannerData={bannerData} />

          <Banner4 bannerData={bannerData} />

          <Banner5 bannerData={bannerData} />

          <Banner6 bannerData={bannerData} />

          <Banner7 bannerData={bannerData} />
        </Row>
      </Container>
    </section>
  );
};

export default ElementCollectionContain;
