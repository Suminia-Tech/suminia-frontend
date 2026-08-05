"use client";
import ConfirmDeleteModal from "@/_template/Components/Pages/UserDashboard/ConfirmDeleteModal";
import DeleteModal from "@/_template/Components/Pages/UserDashboard/DeleteModal";
import CopyConfigModal from "@/_template/Layout/Common/Customizer/CopyConfigModal";
import SizeModal from "@/_template/Layout/Element/SizeModal";
import Overlay from "@/_template/Layout/Overlay";
import { store } from "@/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import CartSuccessModal from "@/_template/Components/Element/CartSuccessModal";
import CommonMobileView from "@/_template/Components/Element/CommonMobileView";
import CommonModel from "@/_template/Components/Element/CommonModel";
import React, { useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";

unstable_batchedUpdates(() => {
  console.error = () => {};
  console.warn = () => {};
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (error.message.includes("ToastContainer")) {
      return;
    }
    return "Uncaught error:", error, errorInfo;
  }

  render() {
    return this.props.children;
  }
}

const RootLayout = ({ children }) => {
  const router = usePathname();
  const pathArr = router.split("/");

  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", "#096AC9");
    if (router.search("/product") === -1) {
      document.body.classList.remove("stickyCart");
    } else if (router === "/page/coming_soon") {
      document.body.classList.add("light-gray-bg");
    } else if (router !== "/page/coming_soon") {
      document.body.classList.remove("light-gray-bg");
    }
  }, [router]);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        {children}
        <Overlay />
        <CartSuccessModal />
        {pathArr.includes("register") || pathArr.includes("login") || pathArr.includes("forgot_password") || (pathArr.includes("coming_soon") !== true && <CommonMobileView />)}
        {/* pauseOnFocusLoss desactivado a proposito: con el valor por defecto,
            salir de la pestana congela el temporizador y los avisos se quedan
            en pantalla indefinidamente, incluso sobre una sesion ya iniciada. */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          pauseOnFocusLoss={false}
          closeOnClick
          newestOnTop
        />
        <SizeModal />
        <CommonModel />
        <DeleteModal />
        <ConfirmDeleteModal />
        <CopyConfigModal />
      </ErrorBoundary>
    </Provider>
  );
};

export default RootLayout;
