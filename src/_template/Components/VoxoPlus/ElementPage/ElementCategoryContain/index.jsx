import { useEffect, useState } from "react";
import { Row } from "reactstrap";
import { getAPIData } from "../../../../Utils";
import ElemCategory1 from "./ElemCategory1";
import ElemCategory2 from "./ElemCategory2";
import ElemCategory3 from "./ElemCategory3";

const ElementCategoryContain = () => {
  const [bannerData, setBannerData] = useState([]);
  const [categoryBanner, setCategoryBanner] = useState([]);
  useEffect(() => {
    const types = ["categorybanner", "banner"];
    types.map((type) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "categorybanner" && setCategoryBanner(res?.data);
        type === "banner" && setBannerData(res?.data);
      });
    });
  }, []);
  const FreshFilter = bannerData.filter((el) => el.subtype === "vegetablesfreshfruits");
  const ShoesFilter = categoryBanner.filter((el) => el.type === "shoes");
  return (
    <section className="overflow-hidden">
      <Row>
        <ElemCategory1 categoryBanner={categoryBanner} />

        <ElemCategory2 FreshFilter={FreshFilter} />

        <ElemCategory3 ShoesFilter={ShoesFilter} />
      </Row>
    </section>
  );
};

export default ElementCategoryContain;
