"use client";
import { store } from "@/ReduxToolkit/store";
import { Provider } from "react-redux";

export default function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
