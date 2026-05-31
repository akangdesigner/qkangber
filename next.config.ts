import type { NextConfig } from 'next'

// 基本安全標頭（先不上嚴格 CSP，避免誤擋自家腳本）
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },              // 防網站被嵌入他站做釣魚
  { key: 'X-Content-Type-Options', value: 'nosniff' },          // 防瀏覽器亂猜檔案類型
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false, // 移除 X-Powered-By，不對外洩漏框架資訊
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
    ]
  },
}

export default nextConfig
