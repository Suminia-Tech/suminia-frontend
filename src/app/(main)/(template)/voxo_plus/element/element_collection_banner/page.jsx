"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import ElementCollectionContain from "@/_template/Components/VoxoPlus/ElementPage/ElementCollection";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import Head from "next/head";

const ElementCollectionBanner = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Element Collection Banner"} title={"Element Collection Banner"} />
      <ElementCollectionContain />
</Layout6>
  );
};

export default ElementCollectionBanner;
