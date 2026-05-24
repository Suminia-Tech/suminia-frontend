"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import { getAPIData } from "@/Utils";
import Layout1 from "@/Layout/Layout1";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import StickyFooter from "@/Components/Products/StickyFooter";
import RecentNotification from "@/Components/Products/RecentNotification";
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
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Producto"} title={"Detalle del producto"} />
      <ProductLeftThumbnailContain />
      <ProductSection productData={productData} />
<RecentNotification />
      <StickyFooter productData={productData} />
    </Layout1>
  );
};

export default ProductLeftThumbnail;
