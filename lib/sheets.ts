function autoExcerpt(content: string, maxLen = 120): string {
  // Strip HTML tags first (Sheets content is HTML)
  const stripped = content.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ')
  const firstPara = stripped
    .split(/\n+/)
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('#') && !l.startsWith('!') && !l.startsWith('```'))
  if (!firstPara) return ''
  const plain = firstPara.replace(/[*_`[\]()]/g, '').replace(/^前言[：:：\s]*/, '').trim()
  return plain.length > maxLen ? plain.slice(0, maxLen) + '…' : plain
}

export type SheetPost = {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  content: string
  featured: boolean
  published: boolean
  coverImage: string
  category: string
  subCategory: string
}

export async function getBlogPostsFromSheets(): Promise<SheetPost[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  if (!sheetId || !apiKey) return []

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/posts!A:O?key=${apiKey}`

  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return []

    const data = await res.json()
    const rows: string[][] = data.values ?? []
    if (rows.length < 2) return []

    const [, ...dataRows] = rows

    return dataRows
      .map((row) => ({
        slug: row[0]?.trim() ?? '',
        title: row[1] ?? '',
        date: row[2] ?? '',
        tags: row[3] ? row[3].split(',').map((t) => t.trim()).filter(Boolean) : [],
        excerpt: row[4]?.trim() || autoExcerpt(row[5] ?? ''),
        content: row[5] ?? '',
        featured: row[6]?.toLowerCase() === 'true',
        published: row[7]?.toLowerCase() === 'true',
        category: row[12]?.trim() ?? '',
        coverImage: row[13]?.trim() ?? '',
        subCategory: row[14]?.trim() ?? '',
      }))
      .filter((p) => p.published && p.slug)
      .sort((a, b) => (a.date > b.date ? -1 : 1))
  } catch {
    return []
  }
}

export type NewsletterIssue = {
  slug: string
  date: string
  subject: string
  summary: string
  htmlBody: string
  published: boolean
}

export async function getNewsletterIssues(): Promise<NewsletterIssue[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  if (!sheetId || !apiKey) return []

  // 必須指定分頁名稱 工作表1，否則 Sheets 會預設抓「第一個分頁」（現為 EEAT），導致電子報讀不到
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent('工作表1')}!A:F?key=${apiKey}`

  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return []

    const data = await res.json()
    const rows: string[][] = data.values ?? []
    if (rows.length < 2) return []

    const [, ...dataRows] = rows

    return dataRows
      .map((row) => ({
        slug: row[0] ?? '',
        date: row[1] ?? '',
        subject: row[2] ?? '',
        summary: row[3] ?? '',
        htmlBody: row[4] ?? '',
        published: row[5]?.toLowerCase() === 'true',
      }))
      .filter((issue) => issue.published && issue.slug)
      .reverse()
  } catch {
    return []
  }
}

export async function getNewsletterIssue(slug: string): Promise<NewsletterIssue | null> {
  const issues = await getNewsletterIssues()
  return issues.find((i) => i.slug === slug) ?? null
}
