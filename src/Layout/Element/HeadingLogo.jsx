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
          width={40}
          height={40}
          alt="logo-icon"
          className="svg-icon"
        />
        <Image
          width={58}
          height={25}
          priority
          src={`${CommonPath}/logo.png`}
          className="img-fluid"
          alt="logo"
        />
      </Link>
    </div>
  );
};
export default HeadingLogo;
