"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ElementDealBannerContain from "@/Components/VoxoPlus/ElementPage/ElementDealBanner";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
import Head from "next/head";

const ElementDealBanner = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Element Deal Banner"} title={"Element Deal Banner"} />
      <ElementDealBannerContain />
</Layout6>
  );
};

export default ElementDealBanner;
