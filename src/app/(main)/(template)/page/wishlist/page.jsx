"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import WishlistProducts from "@/_template/Components/Pages/WishList/WishlistProducts";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import Head from "next/head";

const Wishlist = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Lista de deseos"} title={"Lista de deseos"} />
      <WishlistProducts />
</Layout6>
  );
};

export default Wishlist;
