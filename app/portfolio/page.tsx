import { buildMetadata } from '@/lib/metadata'
import PortfolioV2 from '@/components/portfolio/PortfolioV2'

export const metadata = buildMetadata({
  title: '作品集 — N8N 自動化與 AI 應用實戰案例',
  description: '收錄 N8N 自動化流程、AI Agent 應用、Vibe Coding 開發的真實專案——每個作品都是解決實際問題的工具，不是 demo。',
  keywords: ['N8N 作品案例', 'AI 應用開發', '自動化專案', 'Vibe Coding 作品'],
  path: '/portfolio',
})

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '作品集',
    description: '每個專案都是解決真實問題的工具。從 AI 教師管理系統到行銷自動化工具，Q kangber 的 n8n 與 AI 實戰作品。',
    url: 'https://aiqkangber.com/portfolio',
    author: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://aiqkangber.com' },
      { '@type': 'ListItem', position: 2, name: '作品集', item: 'https://aiqkangber.com/portfolio' },
    ],
  },
]

export default function PortfolioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioV2 />
    </>
  )
}
