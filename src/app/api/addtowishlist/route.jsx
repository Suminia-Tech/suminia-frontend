import { storeId } from "../../ApiData/serverGlobalVariable";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json(); 
    const result = Object.values(body);
    if (!storeId.includes(result[0])) {
      storeId.push(result[0]);
    }
    return NextResponse.json(storeId);
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.error();
  }
}