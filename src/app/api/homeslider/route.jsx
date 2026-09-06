import HomeSlider from '@/_template/ApiData/HomeSlider.json'
import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.json(HomeSlider);
}
