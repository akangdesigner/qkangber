import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function verifyAdmin(request: NextRequest): boolean {
  const session = request.cookies.get('admin_session')?.value
  return !!session && session === process.env.PASSWORD
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const filePath = `content/newsletter/${slug}.mdx`

  const owner = process.env.GITHUB_OWNER ?? 'akangdesigner'
  const repo = process.env.GITHUB_REPO ?? 'qkangber'
  const token = process.env.GITHUB_TOKEN

  if (!token) return NextResponse.json({ error: 'GITHUB_TOKEN 未設定' }, { status: 500 })

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`

  const existing = await fetch(apiUrl, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })
  if (!existing.ok) {
    return NextResponse.json({ error: '找不到電子報 MDX 檔案' }, { status: 404 })
  }

  const { sha } = await existing.json()

  const res = await fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: `newsletter: delete ${slug}`, sha }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: 'GitHub API 失敗', detail: err }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
