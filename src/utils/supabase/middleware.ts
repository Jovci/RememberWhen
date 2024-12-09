import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
  const { data: session } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // If the user is not logged in, redirect to the login page for protected routes
  if (!session && pathname.startsWith('/map')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users from login/signup to map selection
  if (session && ['/login', '/signup'].includes(pathname)) {
    return NextResponse.redirect(new URL('/map-selection', request.url));
  }

  return NextResponse.next();
}
