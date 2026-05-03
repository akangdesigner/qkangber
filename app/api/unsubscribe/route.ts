import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.UNSUBSCRIBE_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook 未設定' }, { status: 500 })
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { email } = body
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: '無效的 Email' }, { status: 400 })
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Webhook 呼叫失敗' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
