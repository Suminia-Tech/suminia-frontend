"use client";
import { usePathname } from "next/navigation";

export default function Head() {
  const router = usePathname();
  const pathArr = router.split("/");

  const rawTitle = pathArr[isNaN(pathArr[pathArr.length - 1]) ? pathArr.length - 1 : pathArr.length - 2]
    .split("_")
    .map((data) =>
      data
        .split("")
        .map((char, i) => (i === 0 ? char.toUpperCase() : char))
        .join("")
    )
    .join(" ");

  const isHome = router === "/" || rawTitle.toLowerCase() === "vegetables";
  const titleName = isHome ? "Marketplace Medicamentos" : `Marketplace Medicamentos | ${rawTitle}`;

  return (
    <>
      <title>{titleName}</title>
      <link rel="icon" type="image/svg+xml" href="/assets/images/favicon/favicon.svg" />
    </>
  );
}
