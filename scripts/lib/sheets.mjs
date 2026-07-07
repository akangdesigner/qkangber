// 共用 Google Sheets client（原本 60+ 支腳本各自重複貼認證樣板）。
// 用法：const { sheets, sheetId } = getSheetsClient()
import { google } from 'googleapis'
import { loadEnv } from './env.mjs'

export function getSheetsClient(env = loadEnv()) {
  const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return { sheets: google.sheets({ version: 'v4', auth }), sheetId: env.GOOGLE_SHEET_ID }
}
