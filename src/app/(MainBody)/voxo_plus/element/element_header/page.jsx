"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import ElementHeaderContain from "@/Components/VoxoPlus/ElementPage/ElementHeaderContain";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const ElementHeader = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Element Header"} title={"Element Header"} />
      <ElementHeaderContain />
      <FlowerSubscribe />
    </Layout1>
  );
};

export default ElementHeader;
