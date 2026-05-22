import { NextResponse } from "next/server";
import Product from "../../ApiData/Product.json";
export function GET(req) {
  const comapreIds = req.nextUrl.searchParams.get("compareProducts") ? JSON.parse(req.nextUrl.searchParams.get("compareProducts")) : [];
   const filterCart = Product.filter((data) => comapreIds.includes(Number(data.id)));
  return NextResponse.json(filterCart);
}
