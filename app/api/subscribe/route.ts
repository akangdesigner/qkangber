import { NextResponse } from 'next/server'
import { subscribeEmail } from '@/lib/convertkit'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: '請輸入有效的 Email 地址' }, { status: 400 })
    }

    await subscribeEmail(email)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : '訂閱失敗，請稍後再試'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
