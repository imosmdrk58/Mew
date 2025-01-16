import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log(data.message);
        return NextResponse.json(
          { message: data.message || "Something went wrong" },
          { status: response.status }
        );
      } catch (err) {
        return NextResponse.json(
          { message: text || "Something went wrong" },
          { status: response.status }
        );
      }
    }

    const data = await response.json();

    // Modern cookies API kullanımı
    const cookieStore = cookies();
    (await cookieStore).set(
      "user",
      JSON.stringify({
        userId: data.user_id,
        username: data.username,
        isAdmin: data.is_admin,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      }
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}
