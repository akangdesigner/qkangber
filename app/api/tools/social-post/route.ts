import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getGroqClient, GROQ_MODEL } from '@/lib/groq'
import { checkRateLimit } from '@/lib/rate-limit'

const SYSTEM_PROMPT = `你是一個愛在 Threads 上分享工作心得的台灣上班族，不是行銷人員。
寫作風格：口語、有點碎念、像在跟朋友講話，偶爾自嘲，不講廢話大道理。
用繁體中文，不用「首先」「綜上所述」「讓我們」這種書面語。

任務：把使用者貼上來的長文，改寫成日常分享感的社群貼文（主貼文 + 第一則留言）。

主貼文原則：
- 開頭從一個真實感的狀況或感受切入，不要口號式開場
- 講 2–3 個從文章裡挖出來的有趣觀點或實用發現，用自己的話說
- 結尾可以是感嘆、疑問、或「你們有沒有遇過這種事？」之類的互動句
- 不超過 250 字，不放 hashtag，不用條列符號

第一則留言原則：
- 延伸補充一兩個文章細節或小提醒，語氣一樣輕鬆
- 最後放 8–10 個 hashtag（繁體中文 + 英文混搭）

只輸出 JSON，不要包含任何其他文字或 markdown：
{"post_content":"主貼文內容","first_comment":"第一則留言內容（含 hashtag）"}`

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export async function POST(request: Request) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  const apiKey = headersList.get('x-api-key')
  const isAuthorized = apiKey && apiKey === process.env.POST_API_KEY
  if (!isAuthorized) {
    const rl = checkRateLimit(ip)
    if (!rl.success) {
      return NextResponse.json(
        { error: '請求過於頻繁，請稍後再試' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    }
  }

  let body: { html?: string; platform?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '無效的請求格式' }, { status: 400 })
  }

  const { html, platform = 'Threads' } = body
  if (!html || html.trim().length < 20) {
    return NextResponse.json({ error: '請貼上文章內容' }, { status: 400 })
  }

  const plainText = stripHtml(html).slice(0, 4000)

  try {
    const client = getGroqClient()
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 1200,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `平台：${platform}\n\n以下是文章內容：\n\n${plainText}`,
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI 回傳格式錯誤')

    const data = JSON.parse(jsonMatch[0]) as { post_content: string; first_comment: string }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : '產生失敗，請稍後再試'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
