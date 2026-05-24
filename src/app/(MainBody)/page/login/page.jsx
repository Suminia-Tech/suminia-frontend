"use client";
import LoginContain from "@/Components/Pages/Login/LoginContain";
import { CommonPath } from "@/Constant";
import ThemeCustomizer from "@/Layout/Common/Customizer";
import Head from "next/head";

const Logins = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <LoginContain />
      <ThemeCustomizer />
    </>
  );
};

export default Logins;
