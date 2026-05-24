"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import { getAPIData } from "@/Utils";
import Layout1 from "@/Layout/Layout1";
import CanvasOffset from "@/Components/Shop/ShopCanvasFilter/CanvasOffset";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ShopFilterHideContain from "@/Components/Shop/ShopFilterHideContain";

const ShopFilterHide = () => {
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    const types = ["products"];
    types.map((type) => {
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
      <BreadCrumb parent={"Tienda"} title={"Tienda"} />
      <ShopFilterHideContain productData={productData} />
<CanvasOffset productData={productData} />
    </Layout1>
  );
};

export default ShopFilterHide;
