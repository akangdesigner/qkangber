// 取得 rate limit 用的客戶端 IP。
// x-forwarded-for 的「最左段」是請求方自己可以偽造的（每次換一個假 IP 就能繞過
// 限流）；信任代理（Zeabur）會把它實際看到的連線來源「附加」在最後，
// 所以取最右段才是可信的來源 IP。
export function getClientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (!xff) return 'unknown'
  const parts = xff.split(',')
  return parts[parts.length - 1]?.trim() || 'unknown'
}
