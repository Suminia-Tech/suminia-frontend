import { useEffect, useState } from "react";
import { getAPIData } from "../../../../Utils";
import ElementDeal1 from "./ElementDeal1";
import ElementDeal2 from "./ElementDeal2";
import ElementDeal3 from "./ElementDeal3";
import ElementDeal4 from "./ElementDeal4";

const ElementDealBannerContain = () => {
  const [bannerData, setBannerData] = useState([]);
  useEffect(() => {
    const types = ["banner"];
    types.map((type, i) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "banner" && setBannerData(res?.data);
      });
    });
  }, []);
  return (
    <section className="">
      <ElementDeal1 bannerData={bannerData} />
      <ElementDeal2 bannerData={bannerData} />
      <ElementDeal3 bannerData={bannerData} />
      <ElementDeal4 bannerData={bannerData} />
    </section>
  );
};

export default ElementDealBannerContain;
