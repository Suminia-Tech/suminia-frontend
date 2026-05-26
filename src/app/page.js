"use client";
import HomeDeal from "@/Components/Home/HomeDeal";
import HomeFresh from "@/Components/Home/HomeFresh";
import HomeSlider from "@/Components/Home/HomeSlider";
import HomeHurryUp from "@/Components/Home/HomeHurryUp";
import HomeNewsUpdate from "@/Components/Home/HomeNewsUpdate";
import HomeOffers from "@/Components/Home/HomeOffers";
import HomePromo from "@/Components/Home/HomePromo";
import HomeTopBanner from "@/Components/Home/HomeTopBanner";
import CommonModel from "@/Components/Element/CommonModel";
import StartModel from "@/Layout/Element/StartModel";
import Layout6 from "@/Layout/Layout6";
import { getAPIData } from "@/Utils";
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
      <StartModel />
      <CommonModel />
    </Layout6>
  );
}
