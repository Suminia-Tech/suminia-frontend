"use client";
import { CommonPath } from "@/Constant";
import Head from "next/head";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ElementCategoryContain from "@/Components/VoxoPlus/ElementPage/ElementCategoryContain";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import Layout1 from "@/Layout/Layout1";

const ElementCategory = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Element Category"} title={"Element Category"} />
      <ElementCategoryContain />
      <FlowerSubscribe />
    </Layout1>
  );
};

export default ElementCategory;
