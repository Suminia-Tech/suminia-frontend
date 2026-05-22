import PortFolio from '../../ApiData/PortFolio.json'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(PortFolio);
}
