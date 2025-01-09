import { NextResponse } from "next/server";

export async function GET() {
  console.log("deneme");

  return NextResponse.json({
    message: "Hello from API",
  });
}
