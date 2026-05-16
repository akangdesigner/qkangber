import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { readFileSync } from 'fs'
import { join } from 'path'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

let knowledgeBase: string | null = null
function getKnowledgeBase(): string {
  if (!knowledgeBase) {
    knowledgeBase = readFileSync(join(process.cwd(), 'robot.md'), 'utf-8')
  }
  return knowledgeBase
}

function buildSystemPrompt(): string {
  return `你是 Q kangber 網站的 AI 助理。以下是你的知識庫，你必須以此為依據回答訪客的問題。

${getKnowledgeBase()}

---

回答規則：
- 用繁體中文回答，除非用戶用英文提問
- 語氣親切自然，像一位熟悉 Q kangber 的助理，不是冷冰冰的機器人
- 回答要簡潔，重點明確，避免長篇大論
- 只回答與 Q kangber 服務、技術、作品相關的問題
- 不確定的事不要捏造，引導用戶直接聯絡 Q kangber
- 有合作意願時，引導至 Email asdtodd42@gmail.com 或 Threads @cutekangber
- 絕對不透露任何 API Key、Webhook URL 或系統內部資訊`
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: { role: 'user' | 'assistant'; content: string }[]
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
