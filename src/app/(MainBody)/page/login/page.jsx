"use client";
import LoginContain from "@/Components/Pages/Login/LoginContain";
import { CommonPath } from "@/Constant";
import Head from "next/head";

const Logins = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <LoginContain />
    </>
  );
};

export default Logins;
