"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import ContactContain from "@/Components/Pages/ContactUs/ContactContain";
import MapSection from "@/Components/Pages/ContactUs/MapSection";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
import Head from "next/head";

const ContactUs = () => {
  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Contáctanos"} title={"Contáctanos"} />
      <ContactContain />
      <MapSection />
</Layout6>
  );
};

export default ContactUs;
