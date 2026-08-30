"use client";
import { store } from "@/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
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
      </ErrorBoundary>
    </Provider>
  );
};

export default RootLayout;
