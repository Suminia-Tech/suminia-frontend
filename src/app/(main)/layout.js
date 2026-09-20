"use client";
import { store } from "@/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
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
      </ErrorBoundary>
    </Provider>
  );
};

export default RootLayout;
