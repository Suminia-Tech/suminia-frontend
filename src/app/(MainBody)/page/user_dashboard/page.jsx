"use client";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import DashboardSidebar from "@/Components/Pages/UserDashboard/DashboardSidebar";
import PaymentCardModal from "@/Components/Pages/UserDashboard/PaymentCardModal";
import ProfileModal from "@/Components/Pages/UserDashboard/ProfileModal";
import SaveAddressModal from "@/Components/Pages/UserDashboard/SaveAddressModal";
import { CommonPath } from "@/Constant";
import Layout6 from "@/Layout/Layout6";
import { useAuth } from "@/hooks/useAuth";
import { getAccountLabel } from "@/Utils/roleLabel";
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
