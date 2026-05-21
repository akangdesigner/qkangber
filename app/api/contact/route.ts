import { NextResponse } from 'next/server'
import { google } from 'googleapis'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: { name?: string; email?: string; service?: string; budget?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, email, service, budget, message } = body

  if (!name?.trim()) return NextResponse.json({ error: '請填寫姓名' }, { status: 400 })
  if (!email || !emailRegex.test(email)) return NextResponse.json({ error: '請輸入有效的 Email' }, { status: 400 })
  if (!message?.trim()) return NextResponse.json({ error: '請描述需求' }, { status: 400 })

  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  const sheetId = process.env.GOOGLE_SHEET_ID

  if (!serviceAccountJson || !sheetId) {
    console.error('[contact] 缺少 GOOGLE_SERVICE_ACCOUNT_JSON 或 GOOGLE_SHEET_ID')
    return NextResponse.json({ error: '系統設定錯誤，請直接來信 asdtodd42@gmail.com' }, { status: 500 })
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
      range: 'contact!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          new Date().toISOString(),
          name.trim(),
          email.trim(),
          service || '未指定',
          budget || '未填',
          message.trim(),
        ]],
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Sheets 寫入失敗:', err)
    return NextResponse.json({ error: '提交失敗，請直接來信 asdtodd42@gmail.com' }, { status: 500 })
  }
}
