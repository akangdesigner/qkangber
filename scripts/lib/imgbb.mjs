// 共用 ImgBB 上傳（原本 export-fanggezi/upload-imgbb 等 20 支腳本各自重複這段）。
// 用法：const url = await uploadImgbb(buf, '檔名')
import { loadEnv } from './env.mjs'

export async function uploadImgbb(buf, name, apiKey) {
  const key = apiKey ?? loadEnv().IMGBB_API_KEY
  if (!key) throw new Error('找不到 IMGBB_API_KEY（.env.local）')
  const body = new URLSearchParams({ key, name, image: buf.toString('base64') })
  const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body })
  const json = await res.json()
  if (!json.success) throw new Error(`ImgBB 上傳失敗：${JSON.stringify(json.error ?? json)}`)
  return json.data.url
}
