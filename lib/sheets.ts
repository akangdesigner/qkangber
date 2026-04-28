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
    const res = await fetch(url, { next: { revalidate: 3600 } })
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
