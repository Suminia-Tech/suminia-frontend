"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import { getAPIData } from "@/Utils";
import Layout1 from "@/Layout/Layout1";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ProductNoSideBarContain from "@/Components/Products/ProductNoSidebarContain";
import ProductSection from "@/Components/Products/Product4ImageContain/ProductSection";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";

const ProductNoSidebar = () => {
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
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Product No Sidebar"} title={"Product No Sidebar"} />
      <ProductNoSideBarContain />
      <ProductSection productData={productData} />
      <FlowerSubscribe />
    </Layout1>
  );
};
export default ProductNoSidebar;
