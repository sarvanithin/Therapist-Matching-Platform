import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/auth/error"]
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route))

  // Define admin routes that require admin role
  const isAdminRoute = pathname.startsWith("/admin")

  // If the route is public, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If the user is not authenticated and the route is not public, redirect to sign in
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If the route is admin and the user is not an admin, redirect to dashboard
  if (isAdminRoute && token.role !== "admin" && token.role !== "superadmin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Allow access to the route
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - node_modules (for MongoDB binary files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|node_modules).*)",
  ],
}
