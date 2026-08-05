import { NextResponse } from "next/server";
import HeaderMenu from "@/_template/ApiData/HeaderMenu.json"

export async function GET() {
  return NextResponse.json(HeaderMenu);
}
