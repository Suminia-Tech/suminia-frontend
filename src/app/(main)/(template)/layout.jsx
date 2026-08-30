"use client";

import { usePathname } from "next/navigation";

import CartSuccessModal from "@/_template/Components/Element/CartSuccessModal";
import CommonMobileView from "@/_template/Components/Element/CommonMobileView";
import CommonModel from "@/_template/Components/Element/CommonModel";
import ConfirmDeleteModal from "@/_template/Components/Pages/UserDashboard/ConfirmDeleteModal";
import DeleteModal from "@/_template/Components/Pages/UserDashboard/DeleteModal";
import CopyConfigModal from "@/_template/Layout/Common/Customizer/CopyConfigModal";
import SizeModal from "@/_template/Layout/Element/SizeModal";
import Overlay from "@/_template/Layout/Overlay";

/* Chatarra de la tienda B2C: carrito, lista de deseos, selector de tallas.
   Vivia en (main)/layout.js y por tanto se montaba tambien sobre el panel del
   proveedor, que ni compra ni tiene tallas — su barra movil llegaba incluso a
   ofrecer un enlace "Cuenta" que ya no existe.

   Baja aqui para que solo la hereden las paginas de la plantilla, y desaparece
   sola conforme esas paginas se vayan borrando. */
const TemplateLayout = ({ children }) => {
  const pathname = usePathname();
  const segments = pathname.split("/");

  return (
    <>
      {children}
      <Overlay />
      <CartSuccessModal />
      {!segments.includes("coming_soon") && <CommonMobileView />}
      <SizeModal />
      <CommonModel />
      <DeleteModal />
      <ConfirmDeleteModal />
      <CopyConfigModal />
    </>
  );
};

export default TemplateLayout;
