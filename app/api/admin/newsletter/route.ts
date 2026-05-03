import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function verifyAdmin(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')?.value
  return !!session && session === process.env.PASSWORD
}

function escapeYaml(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ')
}

function slugify(text: string, date: string): string {
  const base = text
    .toLowerCase()
    .replace(/[\s　]+/g, '-')
    .replace(/[^\w一-鿿-]/g, '')
    .slice(0, 40)
  return `${date.slice(0, 7)}-${base}`
}

function buildMdx(fields: {
  date: string
  subject: string
  summary: string
  published: boolean
  htmlBody: string
}): string {
  const { date, subject, summary, published, htmlBody } = fields
  return `---\ndate: "${date}"\nsubject: "${escapeYaml(subject)}"\nsummary: "${escapeYaml(summary)}"\npublished: ${published}\n---\n\n${htmlBody}`
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    slug?: string
    date?: string
    subject?: string
    summary?: string
    published?: boolean
    htmlBody?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { subject, htmlBody } = body
  if (!subject || !htmlBody) {
    return NextResponse.json({ error: '缺少必填欄位：subject、htmlBody' }, { status: 400 })
  }

  const date = body.date ?? new Date().toISOString().slice(0, 10)
  const summary = body.summary ?? ''
  const published = body.published ?? true
  const slug = body.slug?.trim() || slugify(subject, date)
  const filePath = `content/newsletter/${slug}.mdx`

  const mdxContent = buildMdx({ date, subject, summary, published, htmlBody })
  const encoded = Buffer.from(mdxContent, 'utf-8').toString('base64')

  const owner = process.env.GITHUB_OWNER ?? 'akangdesigner'
  const repo = process.env.GITHUB_REPO ?? 'qkangber'
  const token = process.env.GITHUB_TOKEN

  if (!token) return NextResponse.json({ error: 'GITHUB_TOKEN 未設定' }, { status: 500 })

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`

  let sha: string | undefined
  const existing = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })
  if (existing.ok) {
    const data = await existing.json()
    sha = data.sha
  }

  const payload: Record<string, unknown> = {
    message: `newsletter: ${subject}`,
    content: encoded,
    ...(sha ? { sha } : {}),
  }

  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: 'GitHub API 失敗', detail: err }, { status: 502 })
  }

  return NextResponse.json({ success: true, slug, filePath })
}
