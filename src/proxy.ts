import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
// Middleware function
export async function proxy(request: NextRequest) {
  
  const token = await getToken({
   req: request,
   cookieName: process.env.VERCEL_ENV === "development"
                ? "next-auth.session-token"
                : "__Secure-next-auth.session-token",
   secret: process.env.NEXTAUTH_SECRET,
})
  const { pathname } = request.nextUrl 

  console.log('token:', token)
  // ✅ Authenticated users should NOT access login/signup pages
  if (token &&  (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if ( !token && (pathname === '/dashboard' || pathname === '/main')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }


  // 🚫 Always redirect /home to /
  if (pathname === '/home') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  // protect admin routes
  if (pathname.startsWith('/dashboard') && (!token || token.role !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/salem', request.url))
  }
  // not found 

  // ✅ Allow the request to continue
  return NextResponse.next()
}
 
// Middleware matcher configuration
export const config = {
  matcher: [
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // '/dashboard/:path*',
    // '/workspace/:path*',
  ],
}