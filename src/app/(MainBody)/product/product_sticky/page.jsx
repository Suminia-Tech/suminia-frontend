"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ProductSection from "@/Components/Products/Product4ImageContain/ProductSection";
import ProductStickyContain from "@/Components/Products/ProductStickyContain";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
import { getAPIData } from "@/Utils";
import Head from "next/head";
import { useEffect, useState } from "react";

const ProductSticky = () => {
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    const types = ["products"];
    types.map((type, i) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "products" && setProductData(res?.data);
      });
    });
  }, []);
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Producto"} title={"Detalle del producto"} />
      <ProductStickyContain />
      <ProductSection productData={productData} />
</Layout6>
  );
};
export default ProductSticky;
