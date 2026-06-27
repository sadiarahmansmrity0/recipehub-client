import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/'];
    const isPublicRoute = publicRoutes.some(route => pathname === route);

    // Admin routes
    const isAdminRoute = pathname.startsWith('/admin');

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // For admin routes, we'll handle auth check on the client side
    // The server will validate the token via API calls

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};