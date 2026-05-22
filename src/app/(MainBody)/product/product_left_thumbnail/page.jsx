"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import { getAPIData } from "@/Utils";
import Layout1 from "@/Layout/Layout1";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import StickyFooter from "@/Components/Products/StickyFooter";
import RecentNotification from "@/Components/Products/RecentNotification";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import ProductSection from "@/Components/Products/Product4ImageContain/ProductSection";
import ProductLeftThumbnailContain from "@/Components/Products/ProductLeftThumbnailContain.jsx";

const ProductLeftThumbnail = () => {
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
      <BreadCrumb parent={"Product Left Thumbnail"} title={"Product Left Thumbnail"} />
      <ProductLeftThumbnailContain />
      <ProductSection productData={productData} />
      <FlowerSubscribe />
      <RecentNotification />
      <StickyFooter productData={productData} />
    </Layout1>
  );
};

export default ProductLeftThumbnail;
