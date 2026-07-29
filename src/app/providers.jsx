"use client";
import { store } from "@/ReduxToolkit/store";
import { Provider } from "react-redux";
import { AuthInitializer } from "@/Components/AuthInitializer";
import LoginModal from "@/Components/Pages/Login/LoginModal";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
      <LoginModal />
    </Provider>
  );
}
