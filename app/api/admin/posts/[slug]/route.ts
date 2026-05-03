import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function verifyAdmin(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')?.value
  return !!session && session === process.env.PASSWORD
}

function escapeYaml(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ')
}

function buildMdx(fields: {
  title: string
  date: string
  tags: string[]
  excerpt: string
  featured: boolean
  content: string
}): string {
  const { title, date, tags, excerpt, featured, content } = fields
  const tagsYaml = tags.map((t) => `"${escapeYaml(t)}"`).join(', ')
  return `---\ntitle: "${escapeYaml(title)}"\ndate: "${date}"\ntags: [${tagsYaml}]\nexcerpt: "${escapeYaml(excerpt)}"\nfeatured: ${featured}\n---\n\n${content}`
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params

  let body: {
    title?: string
    date?: string
    tags?: string[]
    excerpt?: string
    featured?: boolean
    content?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { title, content } = body
  if (!title || !content) {
    return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 })
  }

  const date = body.date ?? new Date().toISOString().slice(0, 10)
  const tags = body.tags ?? []
  const excerpt = body.excerpt ?? ''
  const featured = body.featured ?? false

  const filePath = `content/blog/${slug}.mdx`
  const mdxContent = buildMdx({ title, date, tags, excerpt, featured, content })
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
    message: `post: edit ${slug}`,
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

  return NextResponse.json({ success: true })
}
