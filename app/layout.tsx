import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import './globals.css'

const notoSansTC = localFont({
  src: './fonts/NotoSansTC-VariableFont_wght.ttf',
  variable: '--font-noto',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'q kangber — N8N · AI Agent · RAG 自動化工程',
    template: '%s | q kangber',
  },
  description: '專注 N8N 工作流、AI Agent 架構、RAG 資料庫與提示詞工程。把 LLM 從 demo 帶進你的 production 流程。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://yourdomain.com',
    siteName: 'q康寶',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@yourhandle',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${notoSansTC.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
