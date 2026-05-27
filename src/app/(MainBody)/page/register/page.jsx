"use client";
import RegisterSection from "@/Components/Pages/Register/RegisterSection";
import { CommonPath } from "@/Constant";
import Head from "next/head";

const Register = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <RegisterSection />
    </>
  );
};

export default Register;
