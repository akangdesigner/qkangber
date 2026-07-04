import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { subscribeEmail } from '@/lib/convertkit'
import { checkRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/client-ip'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    // 防機器人灌訂閱：同一 IP 10 分鐘最多 5 次
    const headersList = await headers()
    const ip = getClientIp(headersList)
    const rl = checkRateLimit(`subscribe:${ip}`, 5, 10 * 60_000)
    if (!rl.success) {
      return NextResponse.json(
        { error: '操作太頻繁，請稍後再試' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    }

    const { email } = await request.json()

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: '請輸入有效的 Email 地址' }, { status: 400 })
    }

    await subscribeEmail(email)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: '訂閱失敗，請稍後再試' }, { status: 500 })
  }
}
