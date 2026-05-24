"use client";
import ForgotPasswordSection from "@/Components/Pages/ForgotPassword/ForgotPasswordSection";
import { CommonPath } from "@/Constant";
import ThemeCustomizer from "@/Layout/Common/Customizer";
import Head from "next/head";

const ForgotPassword = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <ForgotPasswordSection />
      <ThemeCustomizer />
    </>
  );
};

export default ForgotPassword;
