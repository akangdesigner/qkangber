// Admin session 驗證共用邏輯。
// 用 Web Crypto（非 node:crypto）讓 middleware（Edge/Proxy runtime）與
// Node route handler 都能 import 同一份。
// Cookie 只存密碼的單向雜湊 token，不再存密碼本體。

const SALT = 'qkangber-admin-session-v1'

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** admin_session cookie 應存的值：密碼加鹽後的 SHA-256，一次性推導、無法反推密碼。 */
export async function adminSessionToken(): Promise<string> {
  return sha256Hex(`${SALT}:${process.env.PASSWORD ?? ''}`)
}

/** 驗證 admin_session cookie。 */
export async function isValidAdminSession(session: string | undefined): Promise<boolean> {
  if (!session || !process.env.PASSWORD) return false
  return timingSafeEqualStr(session, await adminSessionToken())
}

/** 驗證登入密碼（兩邊先雜湊再比對，長度一致才能常數時間比較）。 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const expected = process.env.PASSWORD ?? ''
  if (!expected || !password) return false
  return timingSafeEqualStr(await sha256Hex(password), await sha256Hex(expected))
}
