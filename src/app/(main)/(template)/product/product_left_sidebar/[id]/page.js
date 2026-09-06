"use client";
import { getAPIData } from "@/_template/Utils";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import StickyFooter from "@/_template/Components/Products/StickyFooter";
import RecentNotification from "@/_template/Components/Products/RecentNotification";
import ProductSection from "@/_template/Components/Products/Product4ImageContain/ProductSection";
import ProductLeftSidebarContain from "@/_template/Components/Products/ProductLeftSidebarContain";

const ProductDetailsByID = () => {
  const [productData, setProductData] = useState([]);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const segments = window.location.pathname.split("/");
    const id = segments[segments.length - 1];
    setProductId(id);
    getAPIData(`/api/products`).then((res) => setProductData(res?.data));
  }, []);

  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Producto"} title={"Detalle del producto"} />
      <ProductLeftSidebarContain productData={productData} id={productId} />
      <ProductSection productData={productData} />
      <RecentNotification />
      <StickyFooter productData={productData} />
    </Layout6>
  );
};

export default ProductDetailsByID;
