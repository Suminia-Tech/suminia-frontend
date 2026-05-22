import CategoryMenu from "../../ApiData/CategoryMenu.json";
import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.json(CategoryMenu);
}
