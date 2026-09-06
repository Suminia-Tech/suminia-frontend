"use client";
import { CommonPath } from "@/_template/Constant";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import CanvasOffset from "@/_template/Components/Shop/ShopCanvasFilter/CanvasOffset";
import ShopListInfiniteContain from "@/_template/Components/Shop/ShopListInfinite/ShopListInfinite";
import Layout6 from "@/_template/Layout/Layout6";
import { getAPIData } from "@/_template/Utils";
import Head from "next/head";
import { useEffect, useState } from "react";

const ShopListInfinite = () => {
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
      <ShopListInfiniteContain productData={productData} listGrid={listGrid} />
<CanvasOffset productData={productData} />
    </Layout6>
  );
};

export default ShopListInfinite;
