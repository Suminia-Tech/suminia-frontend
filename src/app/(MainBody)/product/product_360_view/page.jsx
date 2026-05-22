"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import Product360ViewContain from "@/Components/Products/Product360Views";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import { getAPIData } from "@/Utils";
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
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Product 360 View"} title={"Product 360 View"} />
      <Product360ViewContain />
      <FlowerSubscribe />
    </Layout1>
  );
};
export default Product360View;
