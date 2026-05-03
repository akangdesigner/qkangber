import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { password } = await request.json()
  const expected = process.env.PASSWORD ?? ''

  if (!password || password !== expected) {
    return NextResponse.json({ error: '密碼錯誤' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ success: true })
}
