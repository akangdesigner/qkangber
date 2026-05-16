import type { Metadata } from 'next'
import PortfolioTabs from '@/components/portfolio/PortfolioTabs'

export const metadata: Metadata = {
  title: '作品集',
  description: '每個專案都是解決真實問題的工具。從 AI 教師管理系統到行銷自動化工具，Q kangber 的 n8n 與 AI 實戰作品。',
  alternates: { canonical: 'https://aiqkangber.com/portfolio' },
}

export default function PortfolioPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#05060a' }}>
      <PortfolioTabs />
    </div>
  )
}
