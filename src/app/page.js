"use client";
import CommonModel from "@/_template/Components/Element/CommonModel";
import Layout6 from "@/_template/Layout/Layout6";
import HomeRedirect from "./HomeRedirect";
import HomeHero from "./HomeHero";
import { FeaturedProducts } from "@/modules/products";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#096AC9");
  }, []);

  /* Ya no se piden banners ni carrusel a la plantilla: eran camisetas, camaras
     4K y zapatos Nike con Lorem Ipsum. Lo unico que se enseña aqui es lo que
     Suminia tiene de verdad. */
  return (
    <Layout6 isCategories={false}>
      {/* Con sesion, cada rol se va a su area; sin ella se queda esta portada. */}
      <HomeRedirect />
      <HomeHero />
      <FeaturedProducts />
      <CommonModel />
    </Layout6>
  );
}
