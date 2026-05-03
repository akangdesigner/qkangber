import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

type Props = { params: Promise<{ slug: string }> }

export async function DELETE(request: Request, { params }: Props) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!session || session !== process.env.PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const owner = process.env.GITHUB_OWNER ?? 'akangdesigner'
  const repo = process.env.GITHUB_REPO ?? 'qkangber'
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    return NextResponse.json({ error: 'GITHUB_TOKEN 未設定' }, { status: 500 })
  }

  // 找出對應的檔案（slug 可能對應多個月份前綴，搜尋目錄）
  const dirUrl = `https://api.github.com/repos/${owner}/${repo}/contents/content/blog`
  const dirRes = await fetch(dirUrl, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })

  if (!dirRes.ok) {
    return NextResponse.json({ error: '無法讀取 GitHub 目錄' }, { status: 502 })
  }

  const files: { name: string; path: string; sha: string }[] = await dirRes.json()
  const target = files.find((f) => f.name.endsWith(`${slug}.mdx`) || f.name === `${slug}.mdx`)

  if (!target) {
    return NextResponse.json({ error: '找不到該文章' }, { status: 404 })
  }

  const delRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${target.path}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: `delete: ${slug}`, sha: target.sha }),
    }
  )

  if (!delRes.ok) {
    const err = await delRes.text()
    return NextResponse.json({ error: 'GitHub 刪除失敗', detail: err }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
