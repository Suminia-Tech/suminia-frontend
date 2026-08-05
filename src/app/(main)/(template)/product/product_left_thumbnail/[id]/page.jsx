"use client";
import Head from "next/head";
import { use, useEffect, useState } from "react";
import { CommonPath } from "@/_template/Constant";
import { getAPIData } from "@/_template/Utils";
import Layout6 from "@/_template/Layout/Layout6";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import ProductSection from "@/_template/Components/Products/Product4ImageContain/ProductSection";
import ProductLeftThumbnailContain from "@/_template/Components/Products/ProductLeftThumbnailContain.jsx";

const ProductLeftThumbnailById = ({ params }) => {
  const { id } = use(params);
  const [singleProduct, setSingleProduct] = useState([]);

  useEffect(() => {
    if (!id) return;
    document.documentElement.style.setProperty("--theme-color", "#096AC9");
    getAPIData(`/api/product/${id}`).then((res) => setSingleProduct(res?.data));
  }, [id]);

  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Producto"} title={"Detalle del producto"} />
      <ProductLeftThumbnailContain singleProduct={singleProduct} />
      <ProductSection />
    </Layout6>
  );
};

export default ProductLeftThumbnailById;
