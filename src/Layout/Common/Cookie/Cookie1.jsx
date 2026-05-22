import { Btn } from "@/Components/AbstractElements";
import { CommonPath, CookieDesp, Iunderstand } from "@/Constant";
import { useState } from "react";
const Cookie1 = () => {
  const [IsShow, setIsShow] = useState(false);
  return (
    <div className={`cookie-bar-section-2 flower-cookirbar d-md-flex d-none ${IsShow ? "hide" : ""}`}>
      <div className="content">
        <picture>
          <img src={`${CommonPath}/cookie.png`} alt="cookie" />
        </picture>
        <p className="font-light">{CookieDesp}</p>
        <div className="cookie-buttons" onClick={() => setIsShow(true)}>
          <Btn attBtn={{ className: "default-theme btn" }}>{Iunderstand}</Btn>
        </div>
      </div>
    </div>
  );
};
export default Cookie1;
