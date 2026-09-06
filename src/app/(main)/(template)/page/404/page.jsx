"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import SectionSvg from "@/_template/Components/Pages/404/SectionSvg";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import Head from "next/head";

const Error = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Página no encontrada"} title={"Página no encontrada"} />
      <SectionSvg />
</Layout6>
  );
};

export default Error;
