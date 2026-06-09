import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CircuitBackdrop from '@/components/effects/CircuitBackdrop'
import MouseSpotlight from '@/components/effects/MouseSpotlight'
import ChatWidget from '@/components/chat/ChatWidget'
import './globals.css'
import './buttons.css'

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

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aiqkangber.com'),
  title: {
    default: 'Q kangber — n8n 自動化 · AI Agent · 電商流程工程',
    template: '%s — Q kangber',
  },
  description: '專注 n8n 工作流、AI Agent 架構、電商與行銷流程自動化。把重複性工作交給 n8n，你只管長遠的事。',
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://aiqkangber.com',
    siteName: 'Q kangber',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Q kangber — n8n 自動化 · AI Agent · 電商流程工程' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${notoSansTC.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full`}>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-J6T5R7BQFW" strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-J6T5R7BQFW');
      `}</Script>
      <body className="min-h-full flex flex-col">
        <CircuitBackdrop />
        <MouseSpotlight />
        <ChatWidget />
        <div className="relative z-[1] flex flex-col flex-1">
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
