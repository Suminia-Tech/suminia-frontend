"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import { getAPIData } from "@/Utils";
import Layout1 from "@/Layout/Layout1";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ProductRightThumbnailContain from "@/Components/Products/ProductRightThumbnailContain.jsx";
import ProductSection from "@/Components/Products/Product4ImageContain/ProductSection";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import RecentNotification from "@/Components/Products/RecentNotification";
import StickyFooter from "@/Components/Products/StickyFooter";

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
      <BreadCrumb parent={"Product Right Thumbnail"} title={"Product Right Thumbnail"} />
      <ProductRightThumbnailContain />
      <ProductSection productData={productData} />
      <FlowerSubscribe />
      <RecentNotification />
      <StickyFooter productData={productData} />
    </Layout1>
  );
};

export default ProductLeftThumbnail;
