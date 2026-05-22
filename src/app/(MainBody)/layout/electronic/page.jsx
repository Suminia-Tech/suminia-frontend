"use client";
import ElectronicCollection from "@/Components/ElectronicDemo/ElectronicCollection";
import ElectronicDeal from "@/Components/ElectronicDemo/ElectronicDeal";
import ElectronicHomeSlider from "@/Components/ElectronicDemo/ElectronicHomeSlider";
import ElectronicHurryUp from "@/Components/ElectronicDemo/ElectronicHurryUp";
import ElectronicInstagramShop from "@/Components/ElectronicDemo/ElectronicInstagramShop";
import ElectronicTopBanner from "@/Components/ElectronicDemo/ElectronicTopBanner";
import ElectronicVR from "@/Components/ElectronicDemo/ElectronicVR";
import FashionService from "@/Components/FashionDemo/FashionService";
import FlowerBrand from "@/Components/FlowerDemo/FlowerBrand";
import StartModel from "@/Layout/Element/StartModel";
import Layout4 from "@/Layout/Layout4";
import { getAPIData } from "@/Utils";
import { useEffect, useState } from "react";

const Electronic = () => {
  const [bannerData, setBannerData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [mainSlider, setMainSlider] = useState([]);
  const [tabSection, setTabSection] = useState([]);
  const isCategories = true;
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#0163d2");
    const types = ["banner", "products", "homeslider", "categorybanner", "tabsection"];
    types.map((type) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "banner" && setBannerData(res?.data);
        type === "products" && setProductData(res?.data);
        type === "homeslider" && setMainSlider(res?.data);
        type === "tabsection" && setTabSection(res?.data);
      });
    });
  }, []);
  const removePadding = true;
  return (
    <Layout4 isCategories={isCategories}>
      <ElectronicHomeSlider mainSlider={mainSlider} />
      <FashionService removePadding={removePadding} />
      <ElectronicTopBanner bannerData={bannerData} />
      <ElectronicCollection productData={productData} />
      <ElectronicDeal bannerData={bannerData} />
      <ElectronicVR productData={productData} />
      <ElectronicHurryUp tabSection={tabSection} />
      <ElectronicInstagramShop bannerData={bannerData} />
      <FlowerBrand />
      <StartModel />
    </Layout4>
  );
};
export default Electronic;
