"use client";
import CommonModel from "@/_template/Components/Element/CommonModel";
import Layout6 from "@/_template/Layout/Layout6";
import HomeRedirect from "./HomeRedirect";
import { CategoryGrid, FeaturedProducts } from "@/modules/products";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#096AC9");
  }, []);

  /* Categorias y productos, y nada mas. No hay banner promocional porque no hay
     promocion, ni buscador aqui porque ya esta en la cabecera, ni frases sobre
     lo que Suminia hace: lo que la portada tiene que hacer es dejar entrar al
     catalogo. */
  return (
    <Layout6 isCategories={false}>
      {/* Con sesion, cada rol se va a su area; sin ella se queda esta portada. */}
      <HomeRedirect />
      <CategoryGrid />
      <FeaturedProducts />
      <CommonModel />
    </Layout6>
  );
}
