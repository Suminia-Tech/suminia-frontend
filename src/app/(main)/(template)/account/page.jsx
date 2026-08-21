"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import DashboardSidebar from "@/_template/Components/Pages/UserDashboard/DashboardSidebar";
import PaymentCardModal from "@/_template/Components/Pages/UserDashboard/PaymentCardModal";
import ProfileModal from "@/_template/Components/Pages/UserDashboard/ProfileModal";
import SaveAddressModal from "@/_template/Components/Pages/UserDashboard/SaveAddressModal";
import Layout6 from "@/_template/Layout/Layout6";
import { getAccountLabel, useAuth } from "@/modules/auth";

const AccountPage = () => {
  const { user } = useAuth();
  const accountLabel = getAccountLabel(user);

  return (
    <Layout6 isCategories={true}>
      <BreadCrumb parent={accountLabel} title={accountLabel} />
      <DashboardSidebar />
      <PaymentCardModal />
      <SaveAddressModal />
      <ProfileModal />
    </Layout6>
  );
};

export default AccountPage;
