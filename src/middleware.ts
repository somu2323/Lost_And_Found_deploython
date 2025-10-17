import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow the request to proceed if authentication is successful
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user has a valid token and email ends with @klh.edu.in
        if (token?.email && token.email.endsWith('@klh.edu.in')) {
          return true;
        }
        return false;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/post-item/:path*',
    '/api/items/:path*',
    '/api/upload/:path*'
  ]
};