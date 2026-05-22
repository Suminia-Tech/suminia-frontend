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
        <link rel="icon" type="image/x-icon" href={`${CommonPath}/favicon/2.png`} />
      </Head>
      <BreadCrumb parent={"User Dashboard"} title={"User Dashboard"} />
      <DashboardSidebar />
      <PaymentCardModal />
      <SaveAddressModal />
      <ProfileModal />
    </Layout1>
  );
};

export default UserDashboard;
