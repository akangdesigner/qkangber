import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getGroqClient, GROQ_MODEL } from '@/lib/groq'
import { checkRateLimit } from '@/lib/rate-limit'

const VISION_MODEL = 'llama-3.2-11b-vision-preview'

const SYSTEM_PROMPT = `你是「量子靈魂感應研究所」的首席分析師，擁有神經行為物理學博士後研究資歷。
你的任務是用嚴肅的學術語氣，將寵物行為解釋為某種複雜的跨領域現象——荒唐之處在於「邏輯推導的結論」，而非病名本身。

診斷命名原則（重要）：
- 病名要像真正的學術術語，不要用「XX綜合症第III期」這種過度卡通的格式
- 好的例子：「邊緣性感知剝奪反應」、「慢性注意力不對等」、「主動性認知解離」、「間歇性領域主權聲索」
- 搞笑來自：用嚴肅術語解釋「牠只是在要飯吃」或「牠只是懶」這種日常行為

引用偽科學時要自然融入（不要列點）：
- 量子糾纏（解釋為何牠知道你要回家）
- 生物磁場共振（解釋牠的某個奇怪行為）
- 超心理學（解釋牠為何盯著空氣）
- 時空感知非線性（解釋烏龜的緩慢）
- 暗物質情緒殘留（解釋負面情緒轉移）

如果提供了照片，從照片讀取「靈魂特徵值」（神態、姿勢、光子密度），作為診斷的客觀依據。

從寵物第一人稱說話，用「我」，語氣根據物種：貓咪疏離帶一點諷刺、狗過度熱情、烏龜哲學性緩慢。
繁體中文，嚴肅但自然，答案裡的笑點來自「推導過程」而不是刻意搞怪的詞彙。

只輸出 JSON，不含任何其他文字或 markdown：
{"mood":"今日情緒磁場（1個emoji加2-4個字）","diagnosis":"學術感的診斷名稱（短，像真正的臨床術語）","answer":"正式感應結果 100-150字，夾雜偽科學推導，結論落在具體行為上","secret":"深層意識，50-80字，第一人稱，比answer更直白坦白內心","scienceFact":"本次核心依據，一句話，引用具體的偽科學理論名稱與數值"}`

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
