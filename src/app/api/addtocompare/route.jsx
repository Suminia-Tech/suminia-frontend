import { compareArr } from "@/app/ApiData/serverGlobalVariable";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = Object.values(body);
    if (!compareArr.includes(result[0])) compareArr.push(result[0]);
    return NextResponse.json(compareArr);
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.error();
  }
}
