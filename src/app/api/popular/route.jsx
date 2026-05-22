import Popular from '../../ApiData/Popular.json'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(Popular);
}
