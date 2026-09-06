import { NextResponse } from "next/server";
import Product from "@/_template/ApiData/Product.json";
import { newArr } from "@/_template/ApiData/serverGlobalVariable";

export async function GET(req) {
  const cartProductIds = req.nextUrl.searchParams.get("addProduct") ? JSON.parse(req.nextUrl.searchParams.get("addProduct")) : [];
  const filterCart = Product.filter((data) => cartProductIds.includes(data.id));
  return NextResponse.json(filterCart);
}
