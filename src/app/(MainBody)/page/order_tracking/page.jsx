"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import OrderTracking from "@/Components/Pages/OrderTracking/OrderTracking";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const Order_tracking = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Seguimiento de pedido"} title={"Seguimiento de pedido"} />
      <OrderTracking />
</Layout1>
  );
};

export default Order_tracking;
