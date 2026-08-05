"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import DashboardSidebar from "@/_template/Components/Pages/UserDashboard/DashboardSidebar";
import PaymentCardModal from "@/_template/Components/Pages/UserDashboard/PaymentCardModal";
import ProfileModal from "@/_template/Components/Pages/UserDashboard/ProfileModal";
import SaveAddressModal from "@/_template/Components/Pages/UserDashboard/SaveAddressModal";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import { useAuth } from "@/modules/auth";
import { getAccountLabel } from "@/modules/auth";
import Head from "next/head";

const UserDashboard = () => {
  const { user } = useAuth();
  const accountLabel = getAccountLabel(user);

  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={accountLabel} title={accountLabel} />
      <DashboardSidebar />
      <PaymentCardModal />
      <SaveAddressModal />
      <ProfileModal />
    </Layout6>
  );
};

export default UserDashboard;
