"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import CompareTable from "@/Components/Pages/Compare/CompareTable";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
import Head from "next/head";

const Compare = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Comparar"} title={"Comparar"} />
      <CompareTable />
</Layout6>
  );
};

export default Compare;
