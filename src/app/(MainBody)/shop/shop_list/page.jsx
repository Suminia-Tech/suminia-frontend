"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CommonPath } from "@/Constant";
import { getAPIData } from "@/Utils";
import Layout6 from "@/Layout/Layout6";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import CanvasOffset from "@/Components/Shop/ShopCanvasFilter/CanvasOffset";
import ShopLeftSidebarContain from "@/Components/Shop/ShopLeftSidebarContain";

const ShopList = () => {
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    const types = ["products"];
    types.map((type) => {
      getAPIData(`/api/${type}`).then((res) => {
        type === "products" && setProductData(res?.data);
      });
    });
  }, []);
  const listGrid = true;
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Tienda"} title={"Tienda"} />
      <ShopLeftSidebarContain productData={productData} listGrid={listGrid} />
<CanvasOffset productData={productData} />
    </Layout6>
  );
};

export default ShopList;
