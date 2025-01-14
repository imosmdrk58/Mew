import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear all auth related cookies
    const cookieStore = await cookies();
    cookieStore.delete('user');
    cookieStore.delete('auth_token');
    cookieStore.delete('session');

    // Backend'e logout isteği gönder
    await fetch('http://localhost:8080/users/logout', {
      method: 'POST',
      credentials: 'include',
    });

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}
