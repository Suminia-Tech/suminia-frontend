import Footer from '../../ApiData/Footer.json'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(Footer);
}
