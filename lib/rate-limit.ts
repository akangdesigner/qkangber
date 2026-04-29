type Entry = { count: number; resetAt: number }

const store = new Map<string, Entry>()

export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 60_000,
): { success: true } | { success: false; retryAfter: number } {
  const now = Date.now()
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
