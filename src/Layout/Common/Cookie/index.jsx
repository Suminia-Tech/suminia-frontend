import { Btn } from "@/Components/AbstractElements";
import { CommonPath, CookieDesp, CookiesConsent, Iunderstand, LearnMore } from "@/Constant";
import Image from "next/image";
import { useState } from "react";
const Cookie = ({ addLeft }) => {
  const [isHide, setIsHide] = useState(false);
  const handleClick = () => setIsHide(true);

  return (
    <>
      <div className={`cookie-bar-section-1${isHide ? " hide" : ""} ${addLeft ? "cookiebar-left-section" : ""}`}>
        <Image width={60} height={62} src={`${CommonPath}/cookie.png`} alt="cookie" />
        <div className="content">
          <h3>{CookiesConsent}</h3>
          <p className="font-light">{CookieDesp}</p>
          <div className="cookie-buttons">
            <Btn
              attrBtn={{
                className: "btn-solid-default",
                id: "button",
                onClick: handleClick,
              }}
            >
              {Iunderstand}
            </Btn>
            <a href="#javascript" className="default-light1 btn">
              {LearnMore}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cookie;
