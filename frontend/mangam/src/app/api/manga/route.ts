import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Get data from request body
    const { limit, sort_by, sort_order } = await request.json();

    // Check for missing parameters
    if (!limit || !sort_by || !sort_order) {
      return NextResponse.json(
        { message: "Missing parameters in body" },
        { status: 400 }
      );
    }

    console.log("limit", limit);
    console.log(
      "Url" +
        `${process.env.NEXT_PUBLIC_API_URL}/manga?limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}`
    );

    // Make request to external API
    const response = await fetch(
      `${process.env.API_URL}/manga?limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}`
    );
    const data = await response.json();

    // Return response to client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching manga:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}