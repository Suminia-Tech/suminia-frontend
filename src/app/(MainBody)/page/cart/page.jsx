"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ProductCart from "@/Components/Pages/Cart";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const Cart = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Cart"} title={"Cart"} />
      <ProductCart />
</Layout1>
  );
};

export default Cart;
