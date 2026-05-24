"use client";
import { getAPIData } from "@/Utils";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import StickyFooter from "@/Components/Products/StickyFooter";
import RecentNotification from "@/Components/Products/RecentNotification";
import ProductSection from "@/Components/Products/Product4ImageContain/ProductSection";
import ProductLeftSidebarContain from "@/Components/Products/ProductLeftSidebarContain";

const ProductDetailsByID = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    getAPIData(`/api/products`).then((res) => {
      setProductData(res?.data);
    });
  }, []);
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Producto"} title={"Detalle del producto"} />
      <ProductLeftSidebarContain productData={productData} id={id}/>
      <ProductSection productData={productData} />
      <RecentNotification />
      <StickyFooter productData={productData} />
    </Layout6>
  );
};

export default ProductDetailsByID;
