import TabSection from '@/_template/ApiData/Tabsection.json'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(TabSection);
}
