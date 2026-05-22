"use client";
import FashionBannerMiddle from "@/Components/FashionDemo/FashionBannerMiddle";
import FashionBannerTop from "@/Components/FashionDemo/FashionBannerTop";
import FashionCategory from "@/Components/FashionDemo/FashionCategory";
import FashionDeal from "@/Components/FashionDemo/FashionDeal";
import FashionHomeSlider from "@/Components/FashionDemo/FashionHomeSlider";
import FashionInstagram from "@/Components/FashionDemo/FashionInstagram";
import FashionNewArrival from "@/Components/FashionDemo/FashionNewArrival";
import FashionNewProduct from "@/Components/FashionDemo/FashionNewProduct";
import FashionService from "@/Components/FashionDemo/FashionService";
import StartModel from "@/Layout/Element/StartModel";
import Layout1 from "@/Layout/Layout1";
import { getAPIData } from "@/Utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Fashion = () => {
  const [bannerData, setBannerData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [mainSlider, setMainSlider] = useState([]);
  const [categoryBanner, setCategoryBanner] = useState([]);
  const router = usePathname();
  const isCookie = router;
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#e22454");
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

  return (
    <>
      <Layout1 isCookie={isCookie}>
        <FashionHomeSlider mainSlider={mainSlider} />
        <FashionBannerTop bannerData={bannerData} />
        <FashionNewArrival productData={productData} />
        <FashionCategory categoryBanner={categoryBanner} />
        <FashionBannerMiddle bannerData={bannerData} />
        <FashionNewProduct productData={productData} />
        <FashionDeal bannerData={bannerData} />
        <FashionInstagram bannerData={bannerData} />
        <FashionService />
        <StartModel />
      </Layout1>
    </>
  );
};
export default Fashion;
