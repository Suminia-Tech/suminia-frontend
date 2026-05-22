"use client";
import RegisterSection from "@/Components/Pages/Register/RegisterSection";
import { CommonPath } from "@/Constant";
import ThemeCustomizer from "@/Layout/Common/Customizer";
import Head from "next/head";

const Register = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <RegisterSection />
      <ThemeCustomizer />
    </>
  );
};

export default Register;
