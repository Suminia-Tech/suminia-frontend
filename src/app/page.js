"use client";
import CommonModel from "@/_template/Components/Element/CommonModel";
import Layout6 from "@/_template/Layout/Layout6";
import HomeRedirect from "./HomeRedirect";
import { HomeForSuppliers, HomeHero, HomeSteps } from "./HomeSections";
import { CategoryGrid, FeaturedProducts } from "@/modules/products";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#096AC9");
  }, []);

  /* Nada de esto sale ya de la plantilla. El orden sigue lo que hace quien
     llega: buscar si sabe lo que quiere, mirar categorias si no, ver que hay
     publicado, entender como funciona, y —si vende— registrarse. */
  return (
    <Layout6 isCategories={false}>
      {/* Con sesion, cada rol se va a su area; sin ella se queda esta portada. */}
      <HomeRedirect />
      <HomeHero />
      <CategoryGrid />
      <FeaturedProducts />
      <HomeSteps />
      <HomeForSuppliers />
      <CommonModel />
    </Layout6>
  );
}
