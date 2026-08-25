"use client";

import { useEffect, useState } from "react";
import { Btn } from "@/_template/Components/AbstractElements";
import { CommonPath, CookieDesp, Iunderstand } from "@/_template/Constant";
import { cookieConsent } from "@/shared/lib/cookieConsent";

/* El aviso recordaba la aceptacion solo en el estado del componente, de modo
   que volvia a salir en cada carga de pagina.

   Arranca en null, que significa "todavia no se ha leido el navegador": el
   servidor y el primer render del cliente no pintan nada, lo que evita tanto
   el desajuste de hidratacion como el parpadeo del aviso a quien ya lo
   acepto. */
const Cookie1 = () => {
  const [accepted, setAccepted] = useState(null);

  useEffect(() => {
    setAccepted(cookieConsent.isAccepted());
  }, []);

  const handleAccept = () => {
    cookieConsent.accept();
    setAccepted(true);
  };

  if (accepted !== false) {
    return null;
  }

  return (
    <div className="cookie-bar-section-2 d-md-flex d-none">
      <div className="content">
        <picture>
          <img src={`${CommonPath}/cookie.png`} alt="cookie" />
        </picture>
        <p className="font-light">{CookieDesp}</p>
        <div className="cookie-buttons" onClick={handleAccept}>
          <Btn attBtn={{ className: "default-theme btn" }}>{Iunderstand}</Btn>
        </div>
      </div>
    </div>
  );
};
export default Cookie1;
