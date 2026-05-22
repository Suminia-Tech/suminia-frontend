"use client";
import FlowerBannerTop from "@/Components/FlowerDemo/FlowerBannerTop";
import FlowerBrand from "@/Components/FlowerDemo/FlowerBrand";
import FlowerDealBanner from "@/Components/FlowerDemo/FlowerDealBanner";
import FlowerHomeSlider from "@/Components/FlowerDemo/FlowerHomeSilder";
import FlowerLatestProduct from "@/Components/FlowerDemo/FlowerLatestProduct";
import FlowerNewOffer from "@/Components/FlowerDemo/FlowerNewOffer";
import FlowerNewsUpdate from "@/Components/FlowerDemo/FlowerNewsUpdate";
import FlowerOurCategory from "@/Components/FlowerDemo/FlowerOurCategory";
import FlowerOurProduct from "@/Components/FlowerDemo/FlowerOurProduct";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import StartModel from "@/Layout/Element/StartModel";
import Layout2 from "@/Layout/Layout2";
import { getAPIData } from "@/Utils";
import { useEffect, useState } from "react";

const Flower = () => {
  const [bannerData, setBannerData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [mainSlider, setMainSlider] = useState([]);
  const [categorybanner, setCategoryBanner] = useState([]);
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#df4246");
    const types = ["banner", "products", "homeslider", "categorybanner"];
    types.map((type) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "banner" && setBannerData(res?.data);
        type === "products" && setProductData(res?.data);
        type === "homeslider" && setMainSlider(res?.data);
        type === "categorybanner" && setCategoryBanner(res?.data);
      });
    });
  }, []);
  const isCategories = true;
  return (
    <Layout2 isCategories={isCategories} customClass={"ms-sm-3 ms-0"}>
      <FlowerHomeSlider mainSlider={mainSlider} />
      <FlowerBannerTop bannerData={bannerData} />
      <FlowerLatestProduct productData={productData} />
      <FlowerOurCategory categorybanner={categorybanner} />
      <FlowerNewOffer bannerData={bannerData} />
      <FlowerOurProduct productData={productData} />
      <FlowerDealBanner bannerData={bannerData} />
      <FlowerNewsUpdate bannerData={bannerData} />
      <FlowerSubscribe />
      <FlowerBrand />
      <StartModel />
    </Layout2>
  );
};
export default Flower;
