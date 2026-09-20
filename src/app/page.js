"use client";
import CommonModel from "@/_template/Components/Element/CommonModel";
import HomeSlider from "@/_template/Components/Home/HomeSlider";
import Layout6 from "@/_template/Layout/Layout6";
import HomeRedirect from "./HomeRedirect";
import { PendingApprovalNotice } from "@/modules/auth";
import { CategoryGrid, FeaturedProducts } from "@/modules/products";
import { getAPIData } from "@/_template/Utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [mainSlider, setMainSlider] = useState([]);

  useEffect(() => {
    /* El banner es contenido de Suminia, no de la plantilla: el texto esta
       escrito en español y habla de medicamentos, y las imagenes se cambiaron
       por material medico. Sigue leyendose del mismo sitio hasta que haya donde
       editarlo sin tocar un JSON. */
    getAPIData(`/api/homeslider`).then((res) => setMainSlider(res?.data ?? []));
  }, []);

  return (
    <Layout6 isCategories={true}>
      {/* Con sesion, cada rol se va a su area; sin ella se queda esta portada. */}
      <HomeRedirect />
      <PendingApprovalNotice />
      <HomeSlider mainSlider={mainSlider} />
      <FeaturedProducts />
      <CategoryGrid />
      <CommonModel />
    </Layout6>
  );
}
