"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import WishlistProducts from "@/Components/Pages/WishList/WishlistProducts";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const Wishlist = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Lista de deseos"} title={"Lista de deseos"} />
      <WishlistProducts />
</Layout1>
  );
};

export default Wishlist;
