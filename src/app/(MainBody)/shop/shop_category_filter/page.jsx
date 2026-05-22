"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import { getAPIData } from "@/Utils";
import Layout1 from "@/Layout/Layout1";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ShopSlider from "@/Components/Shop/ShopCategoryFilter/ShopSlider";
import CanvasOffset from "@/Components/Shop/ShopCanvasFilter/CanvasOffset";
import ShopSection from "@/Components/Shop/ShopCategoryFilter/ShopSection";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";


const ShopCategoryFilter = () => {
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
      <BreadCrumb parent={"Shop Category Filter"} title={"Shop Category Filter"} />
      <ShopSlider />
      <ShopSection productData={productData} />
      <FlowerSubscribe />
      <CanvasOffset productData={productData} />
    </Layout1>
  );
};

export default ShopCategoryFilter;
