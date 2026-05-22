import { storeId } from "@/app/ApiData/serverGlobalVariable";
import { NextResponse } from "next/server";
import Product from "../../../../ApiData/Product.json";

export async function DELETE(req, res) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (req.method === "DELETE") {
    storeId.splice(storeId.indexOf(Number(id)), 1);
    const filterCart = Product.filter((data, i) => storeId.includes(data.id));
    if (id == "all") {
      storeId.splice(0, storeId.length);
      return NextResponse.json([]);
    } else {
      return NextResponse.json(filterCart);
    }
  }
}
