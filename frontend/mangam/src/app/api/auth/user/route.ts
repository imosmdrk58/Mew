// app/api/user/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get("user"); // ✅ await gerek yok

  // Cookie yoksa → Unauthorized
  if (!userCookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    // Cookie'den user bilgisi al
    const userData = JSON.parse(userCookie.value);

    // Backend API'den kullanıcı detaylarını çek
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.username}`,
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

    // Cookie'deki + Backend'deki veriyi birleştirip dön
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
    return NextResponse.json(
      { error: "Invalid user data" },
      { status: 401 }
    );
  }
}
