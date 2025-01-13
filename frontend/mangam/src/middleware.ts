import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const userCookie = request.cookies.get("user");

    if (!userCookie) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    try {
      const userData = JSON.parse(userCookie.value);

      // Kullanıcı bilgilerini backend'den kontrol et
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
        return NextResponse.redirect(new URL("/auth", request.url));
      }

      const userDetails = await response.json();

      if (!userDetails.is_admin) {
        return NextResponse.redirect(new URL("/mangalist", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
