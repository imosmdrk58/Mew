// app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("user");

  if (!userCookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const userData = JSON.parse(userCookie.value);

    // Backend'den kullanıcı bilgilerini kontrol et
    const response = await fetch(
      `http://localhost:8080/users/${userData.username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const userDetails = await response.json();

    return NextResponse.json(
      {
        user: {
          ...userData,
          ...userDetails,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid user data" }, { status: 401 });
  }
}
