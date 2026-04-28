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

const categoryColors: Record<string, string> = {
  電商: 'bg-orange-50 text-orange-700 border-orange-200',
  行銷: 'bg-blue-50 text-blue-700 border-blue-200',
  社群: 'bg-purple-50 text-purple-700 border-purple-200',
  報表: 'bg-green-50 text-green-700 border-green-200',
}

export default function PortfolioPage() {
  const categories = [...new Set(workflows.map((w) => w.category))]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-[#ea580c] flex-shrink-0" />
          <span className="text-[0.68rem] tracking-[0.22em] uppercase text-[#ea580c] font-semibold">
            作品集
          </span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1c1917] leading-tight mb-5">
          實際交付的<br />
          <em>n8n 工作流案例</em>
        </h1>
        <p className="text-[1.05rem] text-[#78716c] max-w-xl leading-relaxed">
          以下是部分交付過的自動化專案。每個案例都有真實的業務背景與可量化的成效。
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <span
            key={cat}
            className={`text-xs font-medium px-3 py-1 rounded-full border ${categoryColors[cat] ?? 'bg-stone-50 text-stone-700 border-stone-200'}`}
          >
            {cat}（{workflows.filter((w) => w.category === cat).length}）
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map((wf, i) => (
          <div
            key={i}
            className="border border-[#e7e5e4] rounded-xl p-6 bg-[#fafaf9] hover:border-[#ea580c]/40 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${categoryColors[wf.category] ?? 'bg-stone-50 text-stone-700 border-stone-200'}`}
              >
                {wf.category}
              </span>
              <span className="text-xs text-[#78716c] whitespace-nowrap">
                {wf.nodes} 個節點
              </span>
            </div>

            <h3 className="font-serif text-lg font-semibold text-[#1c1917] leading-snug mb-3">
              {wf.title}
            </h3>

            <p className="text-sm text-[#78716c] leading-relaxed mb-4">
              {wf.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {wf.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[0.68rem] text-[#78716c] bg-[#f5f5f4] border border-[#e7e5e4] rounded px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-[#e7e5e4]">
              <span className="text-[#ea580c] text-xs flex-shrink-0">成效</span>
              <span className="text-sm font-medium text-[#1c1917]">{wf.result}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-[#e7e5e4] rounded-xl p-8 text-center mt-12">
        <p className="font-serif text-xl font-semibold text-[#1c1917] mb-3">
          想要類似的自動化解決方案？
        </p>
        <p className="text-sm text-[#78716c] mb-6 max-w-sm mx-auto">
          告訴我你目前的流程，我來評估哪些環節可以自動化、能節省多少時間。
        </p>
        <a
          href="mailto:asdtodd42@gmail.com"
          className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#dc4e08] text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors duration-150"
        >
          免費諮詢 →
        </a>
      </div>
    </div>
  )
}
