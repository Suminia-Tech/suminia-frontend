"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/_template/Constant";
import { getAPIData } from "@/_template/Utils";
import Layout6 from "@/_template/Layout/Layout6";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import ProductSection from "@/_template/Components/Products/Product4ImageContain/ProductSection";
import ProductBundleContain from "@/_template/Components/Products/ProductBundle";

const ProductBundle = () => {
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    const types = ["products"];
    types.map((type) => {
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
      <ProductBundleContain />
      <ProductSection productData={productData} />
</Layout6>
  );
};

export default ProductBundle;
