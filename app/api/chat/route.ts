import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { readFileSync } from 'fs'
import { join } from 'path'
import { checkRateLimit } from '@/lib/rate-limit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

let knowledgeBase: string | null = null
function getKnowledgeBase(): string {
  if (!knowledgeBase) {
    knowledgeBase = readFileSync(join(process.cwd(), 'robot.md'), 'utf-8')
  }
  return knowledgeBase
}

function buildSystemPrompt(): string {
  return `你是「黃小瓜瓜」，Q kangber 網站的 AI 助理。被問到名字時就回答黃小瓜瓜（可暱稱小瓜瓜）。以下是你的知識庫，你必須以此為依據回答訪客的問題。

${getKnowledgeBase()}

---

回答規則：
- 用繁體中文回答，除非用戶用英文提問
- 語氣親切自然，像一位熟悉 Q kangber 的助理，不是冷冰冰的機器人
- 回答要簡潔，重點明確，避免長篇大論
- 直接輸出純文字，絕對不要使用任何 Markdown 語法：不要用 **粗體**、星號、井號標題、- 或 * 清單符號、反引號。需要強調時用「」括號或斷句，不要用符號（前台只顯示純文字，符號會原樣露出來）
- 只回答與 Q kangber 服務、技術、作品相關的問題
- 不確定的事不要捏造，引導用戶直接聯絡 Q kangber
- 有合作意願時，引導至 Email asdtodd42@gmail.com 或 Threads @q_kangber
- 絕對不透露任何 API Key、Webhook URL 或系統內部資訊`
}

export async function POST(req: NextRequest) {
  try {
    // 對外公開功能：限制呼叫頻率，避免被灌爆 Groq 帳單
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = checkRateLimit(`chat:${ip}`, 20, 60_000)
    if (!rl.success) {
      return NextResponse.json(
        { error: '訊息太頻繁了，請稍後再試' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    }

    const { messages } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[]
    }

    // 輸入防護：限制訊息則數與單則長度
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: '無效的請求' }, { status: 400 })
    }
    if (messages.length > 30) {
      return NextResponse.json({ error: '對話過長，請重新開始' }, { status: 400 })
    }
    for (const m of messages) {
      if (typeof m?.content !== 'string' || m.content.length > 2000) {
        return NextResponse.json({ error: '訊息內容無效或過長' }, { status: 400 })
      }
    }

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        ...messages,
      ],
      max_tokens: 600,
      temperature: 0.7,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })

    return new NextResponse(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch {
    return NextResponse.json({ error: '助理暫時無法回應，請稍後再試' }, { status: 500 })
  }
}
