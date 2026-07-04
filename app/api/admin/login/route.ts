import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/client-ip'
import { adminSessionToken, verifyAdminPassword } from '@/lib/admin-auth'

export async function POST(request: Request) {
  // 防暴力猜密碼：同一 IP 5 分鐘最多 5 次嘗試
  const headersList = await headers()
  const ip = getClientIp(headersList)
  const rl = checkRateLimit(`login:${ip}`, 5, 5 * 60_000)
  if (!rl.success) {
    return NextResponse.json(
      { error: `嘗試次數過多，請於 ${rl.retryAfter} 秒後再試` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  const { password } = await request.json()

  if (!password || !(await verifyAdminPassword(password))) {
    return NextResponse.json({ error: '密碼錯誤' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', await adminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ success: true })
}
