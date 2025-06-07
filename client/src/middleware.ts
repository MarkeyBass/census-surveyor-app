import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the token from the request cookies
  const token = request.cookies.get('auth_token')?.value

  // Add the token to the request headers if it exists
  const requestHeaders = new Headers(request.headers)
  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure which routes should be handled by the middleware
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
} 