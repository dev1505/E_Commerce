import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    // Clear the cookie by setting it with an expired date
    (await cookies()).set('token', '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0), // expires immediately
    });
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL));
}
