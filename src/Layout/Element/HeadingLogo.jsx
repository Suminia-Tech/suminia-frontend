import { CommonPath } from "@/Constant";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeadingLogo = () => {
  return (
    <div className="brand-logo">
      <Link href={"/"}>
        <img
          src="/assets/svg/icons.svg"
          width={55}
          height={55}
          alt="logo-icon"
          className="svg-icon"
          style={{ marginRight: "10px" }}
        />
        <Image
          width={150}
          height={65}
          priority
          src={`${CommonPath}/logo.png`}
          className="img-fluid"
          style={{ marginRight: "16px" }}
          alt="logo"
        />
      </Link>
    </div>
  );
};
export default HeadingLogo;
