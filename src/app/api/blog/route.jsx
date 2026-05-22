import Blog from '../../ApiData/Blog.json'
import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.json(Blog);
}
