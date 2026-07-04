import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isValidAdminSession } from '@/lib/admin-auth'

export async function middleware(request: NextRequest) {
  // Block Server Action probe requests (bots sending Next-Action header)
  // This app has no Server Actions, so all such requests are invalid.
  if (request.headers.has('next-action')) {
    return new NextResponse(null, { status: 400 })
  }

  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin/login') return NextResponse.next()

  const session = request.cookies.get('admin_session')?.value

  if (!(await isValidAdminSession(session))) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
