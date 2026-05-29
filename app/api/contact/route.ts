import { NextResponse } from 'next/server'
import { google } from 'googleapis'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: {
    brand?: string; name?: string; email?: string
    website?: string; budget?: string; topics?: string[]; message?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { brand, name, email, website, budget, topics, message } = body

  if (!brand?.trim()) return NextResponse.json({ error: '請填寫品牌或公司名稱' }, { status: 400 })
  if (!name?.trim()) return NextResponse.json({ error: '請填寫稱呼' }, { status: 400 })
  if (!email || !emailRegex.test(email)) return NextResponse.json({ error: '請輸入有效的 Email' }, { status: 400 })
  if (!message?.trim()) return NextResponse.json({ error: '請描述想聊聊的內容' }, { status: 400 })

  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!serviceAccountJson || !sheetId) {
    console.error('[contact] 缺少 GOOGLE_SERVICE_ACCOUNT_JSON 或 GOOGLE_SHEET_ID')
    return NextResponse.json({ error: '系統設定錯誤，請直接來信', sysError: true }, { status: 500 })
  }

  try {
    const credentials = JSON.parse(serviceAccountJson)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'contact!A:H',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          new Date().toISOString(),
          brand.trim(),
          name.trim(),
          email.trim(),
          website?.trim() || '',
          budget || '未填',
          Array.isArray(topics) ? topics.join(', ') : '',
          message.trim(),
        ]],
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Sheets 寫入失敗:', err)
    return NextResponse.json({ error: '提交失敗，請直接來信', sysError: true }, { status: 500 })
  }
}
