"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import { getAPIData } from "@/Utils";
import Layout6 from "@/Layout/Layout6";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import StickyFooter from "@/Components/Products/StickyFooter";
import RecentNotification from "@/Components/Products/RecentNotification";
import ProductSection from "@/Components/Products/Product4ImageContain/ProductSection";
import ProductLeftThumbnailContain from "@/Components/Products/ProductLeftThumbnailContain.jsx";

const ProductLeftThumbnailById = () => {
  const [productData, setProductData] = useState([]);
  const [singleProduct, setSingleProduct] = useState([]);

  useEffect(() => {
    const segments = window.location.pathname.split("/");
    const id = segments[segments.length - 1];
    document.documentElement.style.setProperty("--theme-color", "#096AC9");
    getAPIData(`/api/products`).then((res) => setProductData(res?.data));
    getAPIData(`/api/product/${id}`).then((res) => setSingleProduct(res?.data));
  }, []);

  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Producto"} title={"Detalle del producto"} />
      <ProductLeftThumbnailContain singleProduct={singleProduct} />
      <ProductSection productData={productData} />
      <RecentNotification />
      <StickyFooter productData={productData} />
    </Layout6>
  );
};

export default ProductLeftThumbnailById;
