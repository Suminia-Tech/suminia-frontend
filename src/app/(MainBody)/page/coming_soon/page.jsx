"use client";
import SectionSoon from "@/Components/Pages/ComingSoon/SectionSoon";
import { CommonPath } from "@/Constant";
import Head from "next/head";

const Coming_soon = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <SectionSoon />
    </>
  );
};

export default Coming_soon;
