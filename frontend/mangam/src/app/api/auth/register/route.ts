import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Basit validasyon
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password hash
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password_hash: hashedPassword,
        is_admin: true, // todo: admin atamak için kendinizi register yaparken bunu yorumdan kaldırın
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return NextResponse.json(
          { message: data.message || "Registration failed" },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { message: text || "Registration failed" },
          { status: response.status }
        );
      }
    }

    const data = await response.json();

    // Set cookie
    const cookieStore = cookies();
    (await cookieStore).set(
      "user",
      JSON.stringify({
        userId: data.user_id,
        username: data.username,
        isAdmin: data.isAdmin,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      }
    );

    return NextResponse.json(
      { message: "Registration successful", user: data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
