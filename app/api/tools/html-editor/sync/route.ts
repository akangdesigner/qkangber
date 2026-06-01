import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { google } from 'googleapis'
import { Readable } from 'stream'

export const runtime = 'nodejs'

function verifyAdmin(req: NextRequest) {
  const s = req.cookies.get('admin_session')?.value
  return !!s && s === process.env.PASSWORD
}

function autoExcerpt(html: string, max = 120): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > max ? text.slice(0, max) + '…' : text
}

// 部落格深色底上磚紅 #c0392b 對比過低，發布前一律換成琥珀金 #fbbf24（前端正規化的後端保險）
function normalizeHighlightColor(html: string): string {
  return html.replace(/#c0392b/gi, '#fbbf24')
}

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON 未設定於 .env.local')
  const credentials = JSON.parse(raw)
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  })
}

// Upload every base64 <img> to Drive → return HTML with Drive URLs
async function replaceBase64WithDrive(html: string, auth: InstanceType<typeof google.auth.GoogleAuth>): Promise<{ html: string; uploaded: number }> {
  const drive = google.drive({ version: 'v3', auth })

  // Match: <img ...src="data:image/TYPE;base64,DATA"...>
  const re = /<img([^>]*)src="data:image\/([a-zA-Z+]+);base64,([A-Za-z0-9+/=\r\n]+)"([^>]*)>/gi

  type Job = { fullTag: string; before: string; ext: string; data: string; after: string }
  const jobs: Job[] = []
  let m
  const scanner = new RegExp(re.source, 'gi')
  while ((m = scanner.exec(html)) !== null) {
    jobs.push({ fullTag: m[0], before: m[1], ext: m[2], data: m[3].replace(/\s/g, ''), after: m[4] })
  }
  if (jobs.length === 0) return { html, uploaded: 0 }

  let result = html
  let uploaded = 0

  for (const { fullTag, before, ext, data, after } of jobs) {
    try {
      const buf = Buffer.from(data, 'base64')
      const mime = `image/${ext === 'jpg' ? 'jpeg' : ext}`
      const name = `blog-img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext === 'jpeg' ? 'jpg' : ext}`

      const { data: file } = await drive.files.create({
        requestBody: { name, mimeType: mime },
        media: { mimeType: mime, body: Readable.from([buf]) },
        fields: 'id',
      })
      const fileId = file.id!

      await drive.permissions.create({
        fileId,
        requestBody: { type: 'anyone', role: 'reader' },
      })

      const url = `https://drive.google.com/uc?export=view&id=${fileId}`
      const newTag = `<img${before}src="${url}"${after}>`
      result = result.replace(fullTag, newTag)
      uploaded++
    } catch (err) {
      console.error('[html-editor/sync] Drive upload failed:', err)
      // Keep base64 if upload fails; don't abort the whole sync
    }
  }

  return { html: result, uploaded }
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: '請先登入管理後台（/admin/login）' }, { status: 401 })
  }

  let body: { slug: string; title: string; date: string; tags: string; published: boolean; html: string; category?: string; coverImage?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { slug, title, date, tags, published, html: rawHtml, category, coverImage } = body
  if (!slug?.trim() || !title?.trim() || !rawHtml?.trim()) {
    return NextResponse.json({ error: 'slug、title、html 為必填' }, { status: 400 })
  }

  try {
    const auth = getAuth()
    const sheets = google.sheets({ version: 'v4', auth })

    // 1. Upload images + 正規化重點色（紅→琥珀金）
    const { html: uploadedHtml, uploaded } = await replaceBase64WithDrive(rawHtml, auth)
    const cleanHtml = normalizeHighlightColor(uploadedHtml)

    // 2. Build row (A–N: A=slug B=title C=date D=tags E=excerpt F=content G=featured H=published I–L=empty M=category N=coverImage)
    const excerpt = autoExcerpt(cleanHtml)
    const row = [
      slug.trim(),
      title.trim(),
      date,
      tags.trim(),
      excerpt,
      cleanHtml,
      'false',                      // G featured
      published ? 'true' : 'false', // H published
      '',                           // I
      '',                           // J
      '',                           // K
      '',                           // L
      (category ?? '').trim(),      // M category
      (coverImage ?? '').trim(),    // N coverImage
    ]

    const sheetId = process.env.GOOGLE_SHEET_ID!

    // 3. Find existing row by slug (column A)
    const { data: existing } = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'posts!A:A',
    })
    const slugCol: string[] = (existing.values ?? []).map((r) => r[0] ?? '')
    // i > 0 skips the header row (index 0)
    const rowIdx = slugCol.findIndex((s, i) => i > 0 && s === slug.trim())

    let action: string
    let sheetRow: number | null = null

    if (rowIdx > 0) {
      // Update in place (rowIdx is 0-based array index; sheet rows are 1-based)
      sheetRow = rowIdx + 1
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `posts!A${sheetRow}:N${sheetRow}`,
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      })
      action = 'updated'
    } else {
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'posts!A:N',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      })
      action = 'appended'
    }

    return NextResponse.json({ success: true, action, row: sheetRow, uploaded })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '同步失敗'
    console.error('[html-editor/sync]', err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
