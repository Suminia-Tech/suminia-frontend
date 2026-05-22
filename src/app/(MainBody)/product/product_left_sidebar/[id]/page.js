"use client";
import { getAPIData } from "@/Utils";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import StickyFooter from "@/Components/Products/StickyFooter";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import RecentNotification from "@/Components/Products/RecentNotification";
import ProductSection from "@/Components/Products/Product4ImageContain/ProductSection";
import ProductLeftSidebarContain from "@/Components/Products/ProductLeftSidebarContain";

const ProductDetailsByID = ({params}) => {
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    getAPIData(`/api/products`).then((res) => {
      setProductData(res?.data);
    });
  }, []);
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Product Left Sidebar"} title={"Product Left Sidebar"} />
      <ProductLeftSidebarContain productData={productData} id={params.id}/>
      <ProductSection productData={productData} />
      <FlowerSubscribe />
      <RecentNotification />
      <StickyFooter productData={productData} />
    </Layout1>
  );
};

export default ProductDetailsByID;
