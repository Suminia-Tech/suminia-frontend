"use client";
import HomeDeal from "@/_template/Components/Home/HomeDeal";
import HomeFresh from "@/_template/Components/Home/HomeFresh";
import HomeSlider from "@/_template/Components/Home/HomeSlider";
import HomeHurryUp from "@/_template/Components/Home/HomeHurryUp";
import HomeNewsUpdate from "@/_template/Components/Home/HomeNewsUpdate";
import HomeOffers from "@/_template/Components/Home/HomeOffers";
import HomePromo from "@/_template/Components/Home/HomePromo";
import HomeTopBanner from "@/_template/Components/Home/HomeTopBanner";
import CommonModel from "@/_template/Components/Element/CommonModel";
import Layout6 from "@/_template/Layout/Layout6";
import { getAPIData } from "@/_template/Utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [bannerData, setBannerData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [mainSlider, setMainSlider] = useState([]);

  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#096AC9");
    const types = ["banner", "products", "homeslider"];
    types.map((type) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "banner" && setBannerData(res?.data);
        type === "products" && setProductData(res?.data);
        type === "homeslider" && setMainSlider(res?.data);
      });
    });
  }, []);

  return (
    <Layout6 isCategories={true}>
      <HomeSlider mainSlider={mainSlider} />
      <HomeTopBanner bannerData={bannerData} />
      <HomeFresh productData={productData} />
      <HomeOffers bannerData={bannerData} />
      <HomeDeal bannerData={bannerData} />
      <HomePromo />
      <HomeHurryUp bannerData={bannerData} />
      <HomeNewsUpdate bannerData={bannerData} />
      <CommonModel />
    </Layout6>
  );
}
