"use client";
import BreadCrumb from "@/_template/Components/Element/BreadCrumb";
import { CommonPath } from "@/_template/Constant";
import Layout6 from "@/_template/Layout/Layout6";
import Head from "next/head";
import { useEffect } from "react";
import SectionCheckout from "@/_template/Components/Pages/Checkout";
import { useAuth } from "@/modules/auth";
import { OPENLOGINMODAL } from "@/_template/ReduxToolkit/Reducers/ModalReducer";
import { useDispatch } from "react-redux";

const Checkout = () => {
  const { isAuthenticated, hydrated } = useAuth();
  const dispatch = useDispatch();

  // El checkout requiere sesion. Se espera a que la sesion persistida se haya
  // cargado antes de decidir, para no abrir el modal a un usuario ya logueado.
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      dispatch(OPENLOGINMODAL());
    }
  }, [hydrated, isAuthenticated, dispatch]);

  return (
    <Layout6 isCategories={true}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={`${CommonPath}/favicon/favicon.svg`} />
      </Head>
      <BreadCrumb parent={"Finalizar compra"} title={"Finalizar compra"} />
      {isAuthenticated ? (
        <SectionCheckout />
      ) : (
        <div className="container-fluid-lg py-5 text-center">
          <p>Inicia sesión para finalizar tu compra.</p>
        </div>
      )}
    </Layout6>
  );
};

export default Checkout;
