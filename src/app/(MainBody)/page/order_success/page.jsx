"use client";
import OrderDetails from "@/Components/Pages/OrderSuccess/OrderDetails";
import TopSection from "@/Components/Pages/OrderSuccess/TopSection";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
import Head from "next/head";

const Order_success = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <TopSection />
      <OrderDetails />
</Layout6>
  );
};

export default Order_success;
