"use client";
import { HeadData } from "@/Data/TopHeaderData";
import { usePathname } from "next/navigation";

export default function Head() {
  const router = usePathname();
  const pathArr = router.split("/");

  const titleName = pathArr[isNaN(pathArr[pathArr.length - 1]) ? pathArr.length - 1 : pathArr.length - 2]
    .split("_")
    .map((data) =>
      data
        .split("")
        .map((char, i) => (i === 0 ? char.toUpperCase() : char))
        .join("")
    )
    .join(" ");

  const TableRecordSearch = HeadData.filter((item) => {
    return Object.values(item).some((value) => String(value).toLowerCase().includes(titleName.toLowerCase()));
  });
  return (
    <>
      <title>{titleName}</title>
      <link rel="icon" type="image/svg+xml" href="/assets/images/favicon/favicon.svg" />
    </>
  );
}
