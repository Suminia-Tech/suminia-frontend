import { NextResponse } from "next/server";
import Product from "../../ApiData/Product.json";

export function GET(req) {
  const wishlistIds = req.nextUrl.searchParams.get("wishlist") ? JSON.parse(req.nextUrl.searchParams.get("wishlist")) : [];
  const wishlistCart = Product.filter((data) => wishlistIds.includes(data.id));

  return NextResponse.json(wishlistCart);
}
