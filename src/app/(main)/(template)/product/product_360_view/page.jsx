"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import Product360ViewContain from "@/_template/Components/Products/Product360Views";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import { getAPIData } from "@/_template/Utils";
import Head from "next/head";
import { useEffect, useState } from "react";
const Product360View = () => {
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
      <Product360ViewContain />
</Layout6>
  );
};
export default Product360View;
