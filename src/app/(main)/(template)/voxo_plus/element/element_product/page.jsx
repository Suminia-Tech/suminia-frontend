"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import ElementProductContain from "@/_template/Components/VoxoPlus/ElementPage/ElementProductContain";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import { getAPIData } from "@/_template/Utils";
import Head from "next/head";
import { useEffect, useState } from "react";

const ElementProducts = () => {
  const [productData, setProductData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  useEffect(() => {
    const types = ["products", "banner"];
    types.map((type, i) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "products" && setProductData(res?.data);
        type === "banner" && setBannerData(res?.data);
      });
    });
  }, []);
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Element Product"} title={"Element Product"} />
      <ElementProductContain productData={productData} bannerData={bannerData} />
</Layout6>
  );
};

export default ElementProducts;
