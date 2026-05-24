"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import DashboardSidebar from "@/Components/Pages/UserDashboard/DashboardSidebar";
import PaymentCardModal from "@/Components/Pages/UserDashboard/PaymentCardModal";
import ProfileModal from "@/Components/Pages/UserDashboard/ProfileModal";
import SaveAddressModal from "@/Components/Pages/UserDashboard/SaveAddressModal";
import { CommonPath } from "@/Constant";
import Layout1 from "@/Layout/Layout1";
import Head from "next/head";

const UserDashboard = () => {
  return (
    <Layout1>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Mi cuenta"} title={"Mi cuenta"} />
      <DashboardSidebar />
      <PaymentCardModal />
      <SaveAddressModal />
      <ProfileModal />
    </Layout1>
  );
};

export default UserDashboard;
