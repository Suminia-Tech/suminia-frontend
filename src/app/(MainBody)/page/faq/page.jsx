"use client";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import BreadcrumSection from "@/Components/Pages/Faq/BreadCrumSection";
import FaqDetail from "@/Components/Pages/Faq/FaqDetail";
import TopSection from "@/Components/Pages/Faq/TopSection";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const Faq = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadcrumSection />
      <TopSection />
      <FaqDetail />
      <FlowerSubscribe />
    </Layout1>
  );
};

export default Faq;
