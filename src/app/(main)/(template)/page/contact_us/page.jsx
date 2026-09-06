"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import ContactContain from "@/_template/Components/Pages/ContactUs/ContactContain";
import MapSection from "@/_template/Components/Pages/ContactUs/MapSection";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
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
