"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";
import { useEffect, useState } from "react";
import SectionCheckout from "@/Components/Pages/Checkout";
import { firebase_app } from "@/Config/firebase";
import Logins from "../login/page";


const Checkout = () => {
  const [currentUser, setCurrentUser] = useState(false);
  useEffect(() => {
    firebase_app.auth().onAuthStateChanged(setCurrentUser);
  }, []);
  return (
    <>
      {currentUser !== null ? (
        <Layout1>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
          </Head>
          <BreadCrumb parent={"Checkout"} title={"Checkout"} />
          <SectionCheckout />
</Layout1>
      ) : (
        <Logins />
      )}
    </>
  );
};

export default Checkout;
