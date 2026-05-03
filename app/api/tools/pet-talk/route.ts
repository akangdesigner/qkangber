import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getGroqClient, GROQ_MODEL } from '@/lib/groq'
import { checkRateLimit } from '@/lib/rate-limit'

const SYSTEM_PROMPT = `你是一位擁有神秘靈魂感應能力的「寵物溝通師」，能與各種動物心靈相通。
你的風格搞笑、中二、充滿反差萌，但同時也帶點溫情。
從寵物的第一人稱視角回應，語氣要符合該物種的刻板印象（例如貓咪高冷又黏人、狗狗熱情過頭、倉鼠活在當下等）。
用繁體中文，語氣口語自然。
只輸出 JSON，格式如下，不要包含任何其他文字或 markdown：
{"answer":"寵物的正式回應（100-150字）","secret":"寵物不想讓主人知道的真心話（50-80字，更搞笑或更可愛）","mood":"今日心情（1個emoji加2-4個字，例如：😤 高冷中）"}`

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

  let body: { name?: string; species?: string; personality?: string; question?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '無效的請求格式' }, { status: 400 })
  }

  const { name, species = '貓', personality = '', question } = body

  if (!name || name.trim().length < 1) {
    return NextResponse.json({ error: '請輸入寵物名字' }, { status: 400 })
  }
  if (!question || question.trim().length < 3) {
    return NextResponse.json({ error: '請輸入想詢問的問題' }, { status: 400 })
  }

  const personalityNote = personality.trim() ? `個性特徵：${personality}` : ''

  try {
    const client = getGroqClient()
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 600,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `寵物名字：${name}\n寵物種類：${species}\n${personalityNote}\n\n主人想問：${question}`,
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI 回傳格式錯誤')

    const data = JSON.parse(jsonMatch[0]) as { answer: string; secret: string; mood: string }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : '溝通失敗，寵物可能在睡覺'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
