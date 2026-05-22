"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import ElementDealBannerContain from "@/Components/VoxoPlus/ElementPage/ElementDealBanner";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const ElementDealBanner = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Element Deal Banner"} title={"Element Deal Banner"} />
      <ElementDealBannerContain />
      <FlowerSubscribe />
    </Layout1>
  );
};

export default ElementDealBanner;
