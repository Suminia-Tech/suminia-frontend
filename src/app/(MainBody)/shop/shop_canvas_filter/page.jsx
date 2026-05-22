"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import { getAPIData } from "@/Utils";
import Layout1 from "@/Layout/Layout1";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import ShopCanvasFilterContain from "@/Components/Shop/ShopCanvasFilter";
import CanvasOffset from "@/Components/Shop/ShopCanvasFilter/CanvasOffset";

const ShopCanvasFilter = () => {
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    const types = ["products"];
    types.map((type) => {
      getAPIData(`/api/products`).then((res) => {
        type === "products" && setProductData(res?.data);
      });
    });
  }, []);
  const grid5 = true;
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Shop Canvas Filter"} title={"Shop Canvas Filter"} />
      <ShopCanvasFilterContain productData={productData} grid5={grid5} />
      <FlowerSubscribe />
      <CanvasOffset productData={productData} />
    </Layout1>
  );
};

export default ShopCanvasFilter;
