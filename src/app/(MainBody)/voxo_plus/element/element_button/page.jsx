"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ElementButtonContain from "@/Components/VoxoPlus/ElementPage/ElementButtonContain";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
import Head from "next/head";

const ElementButton = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Element Button"} title={"Element Button"} />
      <ElementButtonContain />
</Layout6>
  );
};

export default ElementButton;
