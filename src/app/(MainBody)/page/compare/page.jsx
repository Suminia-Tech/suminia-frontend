"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import CompareTable from "@/Components/Pages/Compare/CompareTable";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const Compare = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Compare"} title={"Compare"} />
      <CompareTable />
</Layout1>
  );
};

export default Compare;
