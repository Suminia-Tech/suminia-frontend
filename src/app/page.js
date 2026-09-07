"use client";
import HomeDeal from "@/_template/Components/Home/HomeDeal";
import HomeSlider from "@/_template/Components/Home/HomeSlider";
import HomeHurryUp from "@/_template/Components/Home/HomeHurryUp";
import HomeNewsUpdate from "@/_template/Components/Home/HomeNewsUpdate";
import HomeOffers from "@/_template/Components/Home/HomeOffers";
import HomePromo from "@/_template/Components/Home/HomePromo";
import HomeTopBanner from "@/_template/Components/Home/HomeTopBanner";
import CommonModel from "@/_template/Components/Element/CommonModel";
import Layout6 from "@/_template/Layout/Layout6";
import HomeRedirect from "./HomeRedirect";
import { FeaturedProducts } from "@/modules/products";
import { getAPIData } from "@/_template/Utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [bannerData, setBannerData] = useState([]);
  const [mainSlider, setMainSlider] = useState([]);

  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#096AC9");
    /* Los productos ya no salen de aqui: los trae FeaturedProducts del catalogo
       real. Los banners y el carrusel siguen siendo de la plantilla hasta que
       haya contenido propio que poner. */
    const types = ["banner", "homeslider"];
    types.map((type) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "banner" && setBannerData(res?.data);
        type === "homeslider" && setMainSlider(res?.data);
      });
    });
  }, []);

  return (
    <Layout6 isCategories={true}>
      {/* Con sesion, cada rol se va a su area; sin ella se queda esta portada. */}
      <HomeRedirect />
      <HomeSlider mainSlider={mainSlider} />
      <HomeTopBanner bannerData={bannerData} />
      {/* Productos de verdad, del catalogo publico. Antes eran los de la
          plantilla: nombres inventados de una tienda de comestibles. */}
      <FeaturedProducts />
      <HomeOffers bannerData={bannerData} />
      <HomeDeal bannerData={bannerData} />
      <HomePromo />
      <HomeHurryUp bannerData={bannerData} />
      <HomeNewsUpdate bannerData={bannerData} />
      <CommonModel />
    </Layout6>
  );
}
