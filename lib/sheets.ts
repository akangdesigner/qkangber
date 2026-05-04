function autoExcerpt(content: string, maxLen = 120): string {
  const firstPara = content
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith('#') && !l.startsWith('!') && !l.startsWith('```'))
  if (!firstPara) return ''
  const plain = firstPara.replace(/[*_`[\]()>]/g, '').trim()
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
}

export async function getBlogPostsFromSheets(): Promise<SheetPost[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  if (!sheetId || !apiKey) return []

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/posts!A:H?key=${apiKey}`

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

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:F?key=${apiKey}`

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
