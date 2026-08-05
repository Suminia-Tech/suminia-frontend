"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import OrderTracking from "@/_template/Components/Pages/OrderTracking/OrderTracking";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import Head from "next/head";

const Order_tracking = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Seguimiento de pedido"} title={"Seguimiento de pedido"} />
      <OrderTracking />
</Layout6>
  );
};

export default Order_tracking;
