"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import SectionSvg from "@/Components/Pages/404/SectionSvg";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const Error = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"404"} title={"404"} />
      <SectionSvg />
</Layout1>
  );
};

export default Error;
