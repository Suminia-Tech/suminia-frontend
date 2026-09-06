"use client";
import { CommonPath } from "@/_template/Constant";
import Head from "next/head";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import ElementCategoryContain from "@/_template/Components/VoxoPlus/ElementPage/ElementCategoryContain";
import Layout6 from "@/_template/Layout/Layout6";

const ElementCategory = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Element Category"} title={"Element Category"} />
      <ElementCategoryContain />
</Layout6>
  );
};

export default ElementCategory;
