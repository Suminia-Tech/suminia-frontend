"use client";
import OrderDetails from "@/Components/Pages/OrderSuccess/OrderDetails";
import TopSection from "@/Components/Pages/OrderSuccess/TopSection";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const Order_success = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <TopSection />
      <OrderDetails />
</Layout1>
  );
};

export default Order_success;
