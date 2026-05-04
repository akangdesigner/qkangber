import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '作品集 — n8n 工作流展示',
  description: '實際交付的 n8n 自動化工作流案例，涵蓋電商、行銷、社群、報表等應用場景。',
}

interface Workflow {
  title: string
  category: string
  tags: string[]
  description: string
  nodes: number
  result: string
}

const workflows: Workflow[] = [
  {
    title: 'Shopify × 黑貓物流自動出貨',
    category: '電商',
    tags: ['Shopify', '物流 API', 'LINE 通知'],
    description: '訂單成立後自動建立出貨單、更新訂單狀態、推播 LINE 通知客戶，從觸發到完成 < 30 秒。',
    nodes: 12,
    result: '每月節省 40 小時人工作業',
  },
  {
    title: '廣告表單 → CRM → 自動分流跟進',
    category: '行銷',
    tags: ['Facebook Lead Ads', 'HubSpot', 'Gmail'],
    description: '表單送出後依潛客分數自動分流：高分立即通知業務，低分進入 Email 培育序列。',
    nodes: 18,
    result: '潛客轉換率提升 35%',
  },
  {
    title: '多平台社群內容自動發布',
    category: '社群',
    tags: ['Notion', 'Instagram API', 'Facebook'],
    description: '從 Notion 資料庫讀取排程內容，自動發布至 Instagram、Facebook，並回報互動數據。',
    nodes: 9,
    result: '每週節省 5 小時排程作業',
  },
  {
    title: '電商週報自動化儀表板',
    category: '報表',
    tags: ['GA4', 'WooCommerce', 'Google Sheets'],
    description: '每週一自動從 GA4、WooCommerce 抓取數據，計算 KPI，更新 Google Sheets 報表並寄送摘要。',
    nodes: 15,
    result: '報表製作時間 3 小時 → 0',
  },
  {
    title: '關鍵字監控 × Slack 即時警報',
    category: '行銷',
    tags: ['Google Alerts', 'Slack', 'Twitter API'],
    description: '監控品牌名稱、競品動態，觸發時即時推播 Slack，分類整理方便行銷團隊即時回應。',
    nodes: 7,
    result: '品牌回應速度從 24 小時縮短至 1 小時內',
  },
  {
    title: '客服 FAQ 自動回覆機器人',
    category: '電商',
    tags: ['LINE Bot', 'OpenAI', 'Google Sheets'],
    description: '接收 LINE 訊息，比對 FAQ 知識庫，以 AI 自動回覆常見問題，無法處理的轉接人工客服。',
    nodes: 11,
    result: '客服詢問量降低 60%',
  },
]

const categoryStyles: Record<string, { bg: string; color: string; border: string }> = {
  電商: { bg: 'rgba(99,102,241,0.10)', color: '#a78bfa', border: 'rgba(139,92,246,0.20)' },
  行銷: { bg: 'rgba(96,165,250,0.10)', color: '#93c5fd', border: 'rgba(96,165,250,0.20)' },
  社群: { bg: 'rgba(167,139,250,0.10)', color: '#c4b5fd', border: 'rgba(167,139,250,0.20)' },
  報表: { bg: 'rgba(34,211,238,0.10)', color: '#67e8f9', border: 'rgba(34,211,238,0.20)' },
}

const defaultStyle = { bg: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: 'rgba(255,255,255,0.10)' }

export default function PortfolioPage() {
  const categories = [...new Set(workflows.map((w) => w.category))]

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(124,92,255,0.10), transparent 60%)' }}
      />

      <div className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
          <span
            className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
            style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Portfolio
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-white leading-tight mb-5 tracking-[-0.02em]">
          實際交付的<br />
          <span
            style={{
              background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 50%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            n8n 工作流案例
          </span>
        </h1>
        <p className="text-[1.05rem] text-slate-400 max-w-xl leading-relaxed">
          以下是部分交付過的自動化專案。每個案例都有真實的業務背景與可量化的成效。
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => {
          const s = categoryStyles[cat] ?? defaultStyle
          return (
            <span
              key={cat}
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
            >
              {cat}（{workflows.filter((w) => w.category === cat).length}）
            </span>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {workflows.map((wf, i) => {
          const s = categoryStyles[wf.category] ?? defaultStyle
          return (
            <div
              key={i}
              className="group rounded-xl p-6 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                  style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                >
                  {wf.category}
                </span>
                <span className="text-xs text-slate-500 whitespace-nowrap font-mono">
                  {wf.nodes} nodes
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white leading-snug mb-3 tracking-[-0.01em]">
                {wf.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {wf.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {wf.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.68rem] text-slate-400 rounded px-2 py-0.5"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-[0.68rem] tracking-[0.12em] uppercase font-semibold" style={{ color: '#a78bfa' }}>成效</span>
                <span className="text-sm font-medium text-white">{wf.result}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="relative rounded-2xl border border-white/[0.08] p-8 text-center mt-12 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(124,92,255,0.10), transparent 60%), #0a0b14',
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(124,92,255,0.4), transparent)' }}
        />
        <p className="text-slate-400 mb-2 text-sm">想要類似的自動化解決方案？</p>
        <p className="text-xl font-semibold text-white mb-5 tracking-[-0.01em]">
          告訴我你目前的流程，我來評估哪些環節可以自動化
        </p>
        <a
          href="mailto:asdtodd42@gmail.com"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-full transition-all hover:scale-[1.02] active:scale-100"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)',
            boxShadow: '0 0 24px rgba(99,102,241,0.35)',
          }}
        >
          免費諮詢 →
        </a>
      </div>
    </div>
  )
}
