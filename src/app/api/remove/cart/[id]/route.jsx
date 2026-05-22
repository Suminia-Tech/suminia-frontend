import { newArr } from "../../../../ApiData/serverGlobalVariable";
import { NextResponse } from "next/server";
import Product from "../../../../ApiData/Product.json";

export async function DELETE(req, { params }) {
  const id = params.id;
  if (req.method === "DELETE") {
    if (id === "all") {
      newArr.splice(0, newArr.length);
      return NextResponse.json([]);
    } else {
      const index = newArr.indexOf(Number(id));
      if (index > -1) newArr.splice(index, 1);
      const filterCart = Product.filter((data) => newArr.includes(data.id));
      return NextResponse.json(filterCart);
    }
  }

  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
