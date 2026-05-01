import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getGroqClient, GROQ_MODEL } from '@/lib/groq'
import { checkRateLimit } from '@/lib/rate-limit'

const SYSTEM_PROMPT = `你是台灣社群行銷專家，熟悉 Threads、Instagram、Facebook 的貼文風格。
用繁體中文寫作，語氣自然不做作，符合台灣用戶習慣。
只輸出 JSON，格式如下，不要包含任何其他文字或 markdown：
{"post_content":"完整貼文正文","hashtags":["#標籤1","#標籤2"]}`

const STYLE_MAP: Record<string, string> = {
  professional: '專業資訊型：條理清楚、有數據或重點、適合品牌帳號',
  casual: '輕鬆幽默型：口語化、有梗、讓人想按讚',
  promo: '限時促銷型：製造緊迫感、突出優惠、有明確 CTA',
  story: '故事敘述型：從一個真實情境或問題出發，引發共鳴',
}

export async function POST(request: Request) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  const rl = checkRateLimit(ip)
  if (!rl.success) {
    return NextResponse.json(
      { error: '請求過於頻繁，請稍後再試' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  let body: { title?: string; summary?: string; platform?: string; style?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '無效的請求格式' }, { status: 400 })
  }

  const { title, summary = '', platform = 'Threads', style = 'casual' } = body
  if (!title || title.trim().length < 3) {
    return NextResponse.json({ error: '請輸入標題' }, { status: 400 })
  }

  const styleDesc = STYLE_MAP[style] ?? STYLE_MAP.casual

  try {
    const client = getGroqClient()
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 800,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `平台：${platform}\n風格：${styleDesc}\n標題：${title}${summary.trim() ? `\n摘要：${summary.trim()}` : ''}\n\n請根據以上資訊，產生一篇適合此平台的貼文，hashtags 最多 10 個。`,
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI 回傳格式錯誤')

    const data = JSON.parse(jsonMatch[0]) as { post_content: string; hashtags: string[] }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : '產生失敗，請稍後再試'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
