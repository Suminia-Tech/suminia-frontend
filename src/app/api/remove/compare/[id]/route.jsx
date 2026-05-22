import { compareArr } from "@/app/ApiData/serverGlobalVariable";
import { NextResponse } from "next/server";
import Product from "../../../../ApiData/Product.json";

export async function DELETE(req, { params }) {
  const id = params.id;
  if (req.method === "DELETE") {
    if (id === "all") {
      compareArr.splice(0, compareArr.length);
      return NextResponse.json([]);
    } else {
      const idNumber = Number(id);
      const index = compareArr.indexOf(idNumber);
      if (index > -1) compareArr.splice(index, 1);
      const filterCart = Product.filter((data) => compareArr.includes(data.id));
      return NextResponse.json(filterCart);
    }
  }

  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
