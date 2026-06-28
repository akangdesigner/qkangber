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
      { protocol: 'https', hostname: 'i.ibb.co' },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
    ]
  },
  async redirects() {
    // 電子報網址從 /newsletter/archive 搬到 /newsletter，用 308 永久轉址保住舊網址的 SEO 權重
    return [
      { source: '/newsletter/archive/:slug', destination: '/newsletter/:slug', permanent: true },
      { source: '/newsletter/archive', destination: '/newsletter', permanent: true },
      // codetools-4 與 socailmedia 內容重複，下架 codetools-4 並永久轉址保留權重
      { source: '/blog/codetools-4', destination: '/blog/socailmedia', permanent: true },
      // codetools-N 改成帶關鍵字的 slug，舊網址 308 轉址保留 SEO 權重
      { source: '/blog/codetools', destination: '/blog/internal-tools-nextjs', permanent: true },
      { source: '/blog/codetools-2', destination: '/blog/html-cleaner-tool', permanent: true },
      { source: '/blog/codetools-3', destination: '/blog/ig-data-tracking', permanent: true },
      { source: '/blog/codetools-5', destination: '/blog/google-search-console-api', permanent: true },
      { source: '/blog/codetools-6', destination: '/blog/customer-service-bot-rag', permanent: true },
    ]
  },
}

export default nextConfig
