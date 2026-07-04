type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

// 過期 entry 原本只有同 key 再來時才會被覆蓋，長時間運行下 Map 只進不出
// （每個假 IP 一筆）；每滿 1000 筆掃一次過期鍵，攤提成本近乎零。
function sweepIfNeeded(now: number) {
  if (store.size < 1000) return
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}

export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 60_000,
): { success: true } | { success: false; retryAfter: number } {
  const now = Date.now()
  sweepIfNeeded(now)
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return { success: true }
  }

  if (entry.count >= limit) {
    return { success: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count++
  return { success: true }
}
