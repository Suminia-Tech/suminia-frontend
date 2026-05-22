"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import FlowerSubscribe from "@/Components/FlowerDemo/FlowerSubscribe";
import ContactContain from "@/Components/Pages/ContactUs/ContactContain";
import MapSection from "@/Components/Pages/ContactUs/MapSection";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const ContactUs = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"Contact Us"} title={"Contact Us"} />
      <ContactContain />
      <MapSection />
      <FlowerSubscribe />
    </Layout1>
  );
};

export default ContactUs;
