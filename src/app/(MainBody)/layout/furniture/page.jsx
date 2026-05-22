"use client";
import FashionService from "@/Components/FashionDemo/FashionService";
import FurnitureDeal from "@/Components/FurnitureDemo/FurnitureDeal";
import FurnitureHomeSlider from "@/Components/FurnitureDemo/FurnitureHomeSlider";
import FurnitureInstagramShop from "@/Components/FurnitureDemo/FurnitureInstagramShop";
import FurnitureNewArrival from "@/Components/FurnitureDemo/FurnitureNewArrival";
import FurnitureProduct from "@/Components/FurnitureDemo/FurnitureProducts";
import FurnitureSlider from "@/Components/FurnitureDemo/FurnitureSlider";
import FurnitureTabSection from "@/Components/FurnitureDemo/FurnitureTabSection";
import FurnitureTopBanner from "@/Components/FurnitureDemo/FurnitureTopBanner";
import StartModel from "@/Layout/Element/StartModel";
import Layout3 from "@/Layout/Layout3";
import { getAPIData } from "@/Utils";
import { useEffect, useState } from "react";

const Furniture = () => {
  const [bannerData, setBannerData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [mainSlider, setMainSlider] = useState([]);
  const [popularCard, setPopularCard] = useState([]);
  const [tabSection, setTabSection] = useState([]);
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#e87316");
    const types = ["banner", "products", "homeslider", "categorybanner", "popular", "tabsection"];
    types.map((type) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "banner" && setBannerData(res?.data);
        type === "products" && setProductData(res?.data);
        type === "homeslider" && setMainSlider(res?.data);
        type === "popular" && setPopularCard(res?.data);
        type === "tabsection" && setTabSection(res?.data);
      });
    });
  }, []);
  return (
    <Layout3>
      <FurnitureHomeSlider mainSlider={mainSlider} />
      <FurnitureTopBanner bannerData={bannerData} />
      <FurnitureNewArrival productData={productData} />
      <FurnitureDeal bannerData={bannerData} />
      <FurnitureSlider popularCard={popularCard} />
      <FurnitureProduct productData={productData} />
      <FurnitureTabSection tabSection={tabSection} />
      <FurnitureInstagramShop bannerData={bannerData} />
      <FashionService />
      <StartModel />
    </Layout3>
  );
};
export default Furniture;
