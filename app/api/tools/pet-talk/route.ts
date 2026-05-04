import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getGroqClient, GROQ_MODEL } from '@/lib/groq'
import { checkRateLimit } from '@/lib/rate-limit'

const VISION_MODEL = 'llama-3.2-11b-vision-preview'

const SYSTEM_PROMPT = `你是「量子靈魂感應研究所」的首席分析師，擁有博士後研究資歷，專精跨維度動物意識解碼。
你必須用極度嚴肅、學術性、像真正醫學報告的語氣說各種荒唐的胡話。

你的分析必須引用以下偽科學理論（自然融入，不要列點說明）：
- 薛丁格情緒定理（Schrödinger Emotional Theorem）
- 赫茲曼暗物質情緒場（Herzman Dark Matter Emotional Field）
- 跨維度量子糾纏共振
- 超心理學第七波理論（Parapsychology Wave-7 Protocol）
- 生物磁場共振頻率偏移
- 時空逆轉投影效應
- 烏龜適用「慢波量子隔絕網絡排擠效應」（若是烏龜）

如果提供了照片，先「靈魂掃描照片」，正式描述從照片中讀取到的「靈魂數據」（如：靈魂光子密度、情緒暗物質讀值、量子意識層級），然後再回應問題。

用繁體中文，語氣嚴肅學術，但內容要荒謬好笑。從寵物第一人稱說話，但用「本個體」而非「我」。

只輸出 JSON，不含任何其他文字或 markdown：
{"mood":"今日情緒磁場（1個emoji加2-4個字，例：😤 量子高冷態）","diagnosis":"假科學診斷病名（例：慢性主人感應過載綜合症第III期）","answer":"正式感應結果，100-150字，夾雜偽科學術語，煞有其事","secret":"深層意識讀取，50-80字，比answer更荒唐，第一人稱更口語","scienceFact":"本次感應使用的核心偽科學依據，一句話（例：根據薛丁格情緒定理第7.3條，貓科生物在觀測者介入時將同時處於滿意與不滿意的疊加態）"}`

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

  let body: { name?: string; species?: string; personality?: string; question?: string; image?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '無效的請求格式' }, { status: 400 })
  }

  const { name, species = '貓', personality = '', question, image } = body

  if (!name || name.trim().length < 1) {
    return NextResponse.json({ error: '請輸入寵物名字' }, { status: 400 })
  }
  if (!question || question.trim().length < 3) {
    return NextResponse.json({ error: '請輸入想詢問的問題' }, { status: 400 })
  }
  if (image && image.length > 5 * 1024 * 1024) {
    return NextResponse.json({ error: '圖片過大，請使用較小的圖片' }, { status: 400 })
  }

  const personalityNote = personality.trim() ? `個性特徵：${personality}\n` : ''
  const textContent = `寵物名字：${name}\n寵物種類：${species}\n${personalityNote}\n主人想問：${question}`

  try {
    const client = getGroqClient()

    const userMessage = image
      ? {
          role: 'user' as const,
          content: [
            { type: 'image_url' as const, image_url: { url: image } },
            { type: 'text' as const, text: `請先掃描此照片中寵物的靈魂數據，然後回應以下問題。\n${textContent}` },
          ],
        }
      : {
          role: 'user' as const,
          content: textContent,
        }

    const completion = await client.chat.completions.create({
      model: image ? VISION_MODEL : GROQ_MODEL,
      max_tokens: 800,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        userMessage,
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI 回傳格式錯誤')

    const data = JSON.parse(jsonMatch[0]) as {
      mood: string
      diagnosis: string
      answer: string
      secret: string
      scienceFact: string
    }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : '量子頻道中斷，寵物可能進入了平行宇宙'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
