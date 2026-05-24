"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ElementCollectionContain from "@/Components/VoxoPlus/ElementPage/ElementCollection";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const ElementCollectionBanner = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Element Collection Banner"} title={"Element Collection Banner"} />
      <ElementCollectionContain />
</Layout1>
  );
};

export default ElementCollectionBanner;
