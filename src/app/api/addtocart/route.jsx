import { newArr } from "../../ApiData/serverGlobalVariable";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = Object.values(body);
    if (!newArr.includes(result[0])) {
      newArr.push(result[0]);
    }
    return NextResponse.json(newArr);
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.error();
  }
}
