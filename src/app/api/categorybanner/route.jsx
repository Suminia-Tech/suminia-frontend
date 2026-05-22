import CategoryBanner from '../../ApiData/CategoryBanner.json'
import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.json(CategoryBanner);
}
