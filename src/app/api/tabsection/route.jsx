import TabSection from '../../ApiData/Tabsection.json'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(TabSection);
}
