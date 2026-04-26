import type { Metadata } from 'next'
import { Lora, Inter } from 'next/font/google'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: '你的名字 — AI 趨勢 & N8N 自動化',
    template: '%s | 你的名字',
  },
  description: '在人與 AI 之間找到平衡。分享 AI 趨勢洞察、N8N 自動化實戰，以及如何讓科技為人服務。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://yourdomain.com',
    siteName: '你的名字',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@yourhandle',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className={`${lora.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
