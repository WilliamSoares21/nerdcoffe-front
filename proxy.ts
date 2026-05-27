import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Define protected routes
  // For this demo, we'll assume anything under /admin or specifically /feed and /articles/private
  const isProtectedRoute =
    pathname.startsWith("/feed") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/articles/private")

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // Redirect from login to feed if already authenticated
  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/feed", request.url))
  }

  return NextResponse.next()
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
