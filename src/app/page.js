"use client";
import CommonModel from "@/_template/Components/Element/CommonModel";
import Layout6 from "@/_template/Layout/Layout6";
import HomeRedirect from "./HomeRedirect";
import HomeBanner from "./HomeBanner";
import { CategoryGrid, FeaturedProducts } from "@/modules/products";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#096AC9");
  }, []);

  /* Banda, categorias y productos. Sin buscador propio —ya esta en la
     cabecera— y sin promociones inventadas: lo que la portada tiene que hacer
     es dejar entrar al catalogo. */
  return (
    <Layout6 isCategories={true}>
      {/* Con sesion, cada rol se va a su area; sin ella se queda esta portada. */}
      <HomeRedirect />
      <HomeBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <CommonModel />
    </Layout6>
  );
}
