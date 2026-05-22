"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import OrderTracking from "@/Components/Pages/OrderTracking/OrderTracking";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const Order_tracking = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Order Tracking"} title={"Order Tracking"} />
      <OrderTracking />
      <FlowerSubscribe />
    </Layout1>
  );
};

export default Order_tracking;
