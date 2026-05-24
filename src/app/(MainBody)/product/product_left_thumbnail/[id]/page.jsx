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

const ProductLeftThumbnailById = ({ params }) => {
  const [productData, setProductData] = useState([]);
  const [singleProduct, setSingleProduct] = useState([]);

  useEffect(() => {
    getAPIData(`/api/products`).then((res) => setProductData(res?.data));
    getAPIData(`/api/product/${params.id}`).then((res) => setSingleProduct(res?.data));
  }, [params.id]);

  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Producto"} title={"Detalle del producto"} />
      <ProductLeftThumbnailContain singleProduct={singleProduct} />
      <ProductSection productData={productData} />
      <RecentNotification />
      <StickyFooter productData={productData} />
    </Layout1>
  );
};

export default ProductLeftThumbnailById;
