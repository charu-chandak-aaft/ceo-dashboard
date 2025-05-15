// app/middleware.js

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token'); // Replace with your auth logic

  // If the token doesn't exist, redirect to login page
  if (!token && request.url.includes('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// This middleware will apply to all routes in the `app/admin` directory
export const config = {
  matcher: ['/admin/*'],
};
