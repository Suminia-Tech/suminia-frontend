import PortFolio from '@/_template/ApiData/PortFolio.json'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(PortFolio);
}
