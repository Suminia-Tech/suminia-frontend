"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ProductCart from "@/Components/Pages/Cart";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
import Head from "next/head";

const Cart = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Carrito"} title={"Carrito"} />
      <ProductCart />
</Layout6>
  );
};

export default Cart;
