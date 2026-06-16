// ─────────────────────────────────────────────────────────────
// Service detail ("case study") data — all 13 services.
// Ported from the Claude Design "服務內頁" handoff (services-data.js),
// which was itself distilled from content/services/*.mdx. Drives the
// rich detail layout in app/services/[slug]/page.tsx.
//   metric → flagship before→after stat   kpis → impact table
//   flow   → numbered workflow steps       caps → capability cards
//   scope  → included / excluded           tiers → price ladder
// `published: false` entries are site drafts (no public route).
// ─────────────────────────────────────────────────────────────

export type SvcKind = 'n8n' | 'ai' | 'product'
export type SvcFlowStep = { title: string; desc: string }
export type SvcCap = { title: string; desc: string }
export type SvcScope = { yes: string[]; no: string[] }
export type SvcTier = { type: string; range: string; price: string }
export type SvcMetric = { before: string; after: string; label: string }
export type SvcFaq = { q: string; a: string }

export interface ServiceDetail {
  slug: string
  index: string
  published: boolean
  kind: SvcKind
  icon: string
  cat: string
  title: string
  tagline: string
  desc: string
  tags: string[]
  platforms: string[]
  metric: SvcMetric | null
  kpis: [string, string, string][] | null
  problem: string
  flowLabel?: string
  flow?: SvcFlowStep[]
  capsLabel?: string
  caps?: SvcCap[]
  scope?: SvcScope
  audience?: string[] | null
  deliverables?: string[] | null
  price: string
  priceNote: string
  addons?: string[]
  tiers?: SvcTier[]
  faq: SvcFaq[]
}

export const SERVICES_DETAIL: ServiceDetail[] = [
  {
    slug: 'ecommerce-automation', index: '01', published: true, kind: 'n8n',
    icon: '🛒', cat: '電商',
    title: '電商訂單自動化', tagline: '用 n8n 把訂單到出貨全程自動化',
    desc: '從訂單成立、庫存確認、金流對帳到出貨與物流通知，用 n8n 串接你的電商平台與第三方物流，全程自動化處理，減少人工抄寫、降低出錯率，讓你專心把東西賣得更好。',
    tags: ['電商', '訂單管理', 'SHOPLINE', '蝦皮'],
    platforms: ['SHOPLINE', '蝦皮', '91App', 'Cyberbiz', '黑貓物流', 'LINE'],
    metric: { before: '每筆 10 分鐘', after: '< 30 秒', label: '處理時間' },
    kpis: [['每筆訂單處理時間', '8–12 分鐘', '< 30 秒'], ['人工抄寫', '每筆手 key', '0'], ['客服詢問量', '基準', '−40%']],
    problem: '每天手動複製訂單到倉儲系統、通知物流、更新庫存——這些重複性操作不只耗時，還容易出錯。一旦訂單量上升，人力成本直線暴增。',
    flowLabel: '自動化流程',
    flow: [
      { title: '訂單觸發', desc: '新訂單成立，n8n 立即接收通知（SHOPLINE / 蝦皮 / 91App / Cyberbiz，Shopify、WooCommerce 等國外平台也支援）' },
      { title: '庫存核對', desc: '自動檢查庫存狀態，不足時通知採購' },
      { title: '物流對接', desc: '自動建立黑貓 / 7-11 / 新竹物流出貨單' },
      { title: '客戶通知', desc: '發送出貨確認信 + LINE 推播，附帶追蹤連結' },
      { title: '後台更新', desc: '訂單狀態、庫存數字自動同步至報表' },
    ],
    audience: ['月訂單量 100–5000 筆的中小型電商', '目前靠人工處理訂單流程', '想要節省客服與倉管人力成本'],
    deliverables: ['需求訪談與流程設計（1 次線上會議）', 'n8n 工作流程建置與測試', '與你的電商平台 / 物流商 API 串接', '上線後 2 週免費調整', '操作教學文件'],
    price: 'NT$ 9,000', priceNote: '依整合系統數量與複雜度調整',
    faq: [
      { q: '支援哪些電商平台？只能用國外平台嗎？', a: '不綁定特定平台，台灣常用的 SHOPLINE、蝦皮、91App、Cyberbiz、meepShop 都可以串。沒有公開 API 的平台（如蝦皮）就用每日匯出的訂單檔自動處理；國外的 Shopify、WooCommerce 也支援。只要平台能匯出資料或有 API / Webhook 就能評估。' },
      { q: '訂單量很少，值得自動化嗎？', a: '月訂單 100 筆以上通常回本很快。100 筆以下可以先從最耗時的單一流程（如通知或報表）切入，不一定要全套。' },
      { q: '上線後如果平台改版 API 壞掉怎麼辦？', a: '上線後有 2 週免費調整期。之後平台改版造成的問題可以按次報價修復，或簽維護合約定期檢查。' },
    ],
  },

  {
    slug: 'data-report-automation', index: '02', published: true, kind: 'n8n',
    icon: '📊', cat: '電商',
    title: '數據報表自動化', tagline: 'n8n 自動抓取、計算、定時發送報表',
    desc: '不用再人工整理 Excel，n8n 自動從資料庫、Google Sheets 與各家平台 API 抓取數據，計算彙整後定時把報表發到信箱或群組——每天早上老闆和團隊一打開就看到最新數字。',
    tags: ['報表', 'Google Sheets', '數據分析', '自動化'],
    platforms: ['GA4', 'Google Sheets', 'Looker Studio', '廣告後台', 'CRM'],
    metric: { before: '2–4 小時', after: '0 小時', label: '報表製作' },
    kpis: [['報表製作時間', '2–4 小時', '0'], ['更新頻率', '每週', '每日'], ['異常發現', '1–7 天', '< 30 分']],
    problem: '週報、月報靠人工從各系統複製貼上資料，每次要花 2–4 小時，還容易算錯。老闆想要即時數據，但人力跟不上。',
    flowLabel: '自動化流程',
    flow: [
      { title: '多源資料整合', desc: '自動從 GA4、廣告後台、電商平台、CRM 抓取數據' },
      { title: '自動計算', desc: 'KPI 指標運算、環比同比計算，無需人工處理' },
      { title: '視覺化報表', desc: '自動更新 Google Data Studio / Looker Studio 儀表板' },
      { title: '定時發送', desc: '每週一自動發送 Email 報告給指定收件人' },
      { title: '異常警示', desc: '數據超出閾值時立即通知（業績驟降、廣告費暴增等）' },
    ],
    audience: null,
    deliverables: ['報表需求訪談與設計', '各數據源 API 串接', 'n8n 排程工作流建置', 'Google Sheets / Data Studio 模板客製', '上線後 2 週調整'],
    price: 'NT$ 6,000', priceNote: '依數據源數量與報表複雜度調整',
    faq: [
      { q: '資料來源分散在很多地方，可以整合嗎？', a: '可以。只要有 API 或匯出功能的資料來源都能整合，常見的有 Google Analytics、廣告後台、電商平台、Google Sheets、資料庫等。' },
      { q: '報表格式可以客製化嗎？', a: '可以。從欄位、計算公式、視覺化圖表到發送格式（Email、Slack、Google Sheets）都可以依你的需求設計。' },
      { q: '我的團隊不懂技術，能自己維護嗎？', a: '上線後會提供操作教學文件，一般的調整（如更改發送時間、新增欄位）不需要寫程式。更大的改動可以找我協助。' },
    ],
  },

  {
    slug: 'marketing-automation', index: '03', published: true, kind: 'n8n',
    icon: '📈', cat: '行銷',
    title: '行銷漏斗自動化', tagline: '用 n8n 把潛客到成交全程自動跟進',
    desc: '潛客填表、自動分流、Email 跟進到成交通知，用 n8n 串接你的行銷工具，每個環節自動追蹤，不漏掉任何一個潛在客戶。',
    tags: ['行銷', '潛客管理', 'CRM', 'Email 行銷'],
    platforms: ['HubSpot', 'Pipedrive', 'Airtable', 'Meta Lead Ads', 'Email'],
    metric: { before: '1–3 天', after: '< 5 分鐘', label: '跟進延遲' },
    kpis: [['追蹤覆蓋', '60%', '100%'], ['跟進延遲', '1–3 天', '< 5 分'], ['潛客建檔', '手動輸入', '自動寫入']],
    problem: '潛客填了表單之後沒人跟進、Email 開信後不知道該做什麼、廣告帶來的流量沒有被有效培育——這些都是行銷漏斗中的漏洞。',
    flowLabel: '自動化流程',
    flow: [
      { title: '潛客捕捉', desc: '表單填寫觸發，自動建立 CRM 聯絡人（支援 HubSpot / Pipedrive / Airtable）' },
      { title: '行為評分', desc: '依開信、點擊、網站瀏覽自動計算潛客分數' },
      { title: '分級培育', desc: '高分潛客即時通知業務；低分潛客進入 Email 培育序列' },
      { title: '自動跟進', desc: '3 天未回應自動發送提醒；7 天未行動重新分組' },
      { title: '成效回報', desc: '每週自動產生轉換漏斗報表，發送至指定信箱' },
    ],
    audience: ['有跑付費廣告但轉換率偏低', '業務團隊苦於手動追蹤潛客', '想要建立系統化的潛客培育機制'],
    deliverables: ['行銷漏斗現況分析', 'n8n 自動化流程設計與建置', 'CRM / Email 工具串接設定', 'A/B 測試框架建立', '上線後 4 週陪跑優化'],
    price: 'NT$ 12,000', priceNote: '依整合工具數與培育序列複雜度調整',
    faq: [
      { q: '需要有 CRM 系統才能用嗎？', a: '不一定。可以從 Google Sheets 或 Notion 做為簡易 CRM 出發，之後有需要再升級到 HubSpot 或其他工具。' },
      { q: 'Email 開信率低，自動化有用嗎？', a: '自動化解決的是「即時跟進」的問題，不是 Email 內容品質。搭配 A/B 測試主旨和個人化內容，才能同時提升開信率。' },
      { q: '可以跟現有的廣告投放串接嗎？', a: '可以。常見的做法是把廣告表單（Meta Lead Ads、Google 表單）接進自動化流程，第一時間觸發跟進。' },
    ],
  },

  {
    slug: 'social-media-automation', index: '04', published: true, kind: 'n8n',
    icon: '📱', cat: '行銷',
    title: '社群媒體自動化', tagline: 'n8n 跨平台排程、監控與數據回報',
    desc: '用 n8n 自動化社群內容排程、互動監控與數據回報——跨 Threads、Instagram、Facebook，一套流程統一管理。',
    tags: ['社群媒體', 'Instagram', 'Facebook', 'LINE'],
    platforms: ['Notion', 'Instagram', 'Facebook', 'Threads', 'LINE'],
    metric: { before: '每週 5 小時', after: '< 30 分', label: '排程作業' },
    kpis: [['排程時間', '5 小時', '< 30 分'], ['平台覆蓋', '1–2 個', '5+'], ['互動回報', '人工', '自動']],
    problem: '每天在不同平台手動發文、回覆留言、整理數據，耗掉大量時間卻難以擴張。沒有系統化管理，社群帳號難以持續成長。',
    flowLabel: '自動化流程',
    flow: [
      { title: '內容排程', desc: '從 Notion / Google Sheet 讀取內容計畫，自動發布至 IG、FB、LINE' },
      { title: '關鍵字監控', desc: '即時偵測品牌提及、競品動態，推播至 Slack / Line' },
      { title: '互動管理', desc: '特定留言關鍵字自動回覆 DM，節省客服時間' },
      { title: '數據彙整', desc: '每週自動抓取各平台數據，生成比較報表' },
      { title: '病毒預警', desc: '貼文互動異常時立即通知，抓住擴散時機' },
    ],
    audience: ['品牌社群小編 / 數位行銷人員', '需要同時管理多個平台帳號', '想要從數據出發優化發文策略'],
    deliverables: null,
    price: 'NT$ 6,000', priceNote: '依平台數量與自動化程度調整',
    faq: [
      { q: '支援哪些社群平台？', a: '主要支援 Instagram、Facebook、LINE 官方帳號、Threads。YouTube 和 TikTok 排程依 API 開放程度評估。' },
      { q: '自動排程的貼文效果比手動差嗎？', a: '平台演算法不會因為使用排程工具而降低觸及，重點還是內容本身。自動化幫你穩定發布頻率，這對觸及有正面影響。' },
      { q: '貼文內容還是要自己寫嗎？', a: '是的，內容創作仍需要你或你的團隊來做。這個服務負責的是排程、發布、跨平台同步和數據回報的自動化部分。' },
    ],
  },

  {
    slug: 'customer-service-bot', index: '05', published: true, kind: 'ai',
    icon: '🤖', cat: '客服與 AI',
    title: '客服 AI 自動回覆', tagline: 'LINE/IG 訊息接到 GPT，FAQ 自動處理',
    desc: '把 LINE OA、IG DM 接到 OpenAI，FAQ 自動回、複雜的轉人工，n8n 全程記錄對話，客服只處理真正重要的訊息。',
    tags: ['客服', 'LINE Bot', 'OpenAI', '聊天機器人'],
    platforms: ['LINE Bot', 'OpenAI', 'Notion'],
    metric: { before: '8–12 小時', after: '< 10 秒', label: '回覆延遲' },
    kpis: [['回覆延遲', '8–12 小時', '< 10 秒'], ['人工客服負擔', '基準', '−60%'], ['可服務時段', '上班時間', '24/7']],
    problem: '客服人員每天重複回答相同問題——運費多少、何時出貨、如何退換貨——這些 FAQ 佔掉大量時間，卻幾乎不需要人工判斷。',
    flowLabel: '自動化流程',
    flow: [
      { title: '接收訊息', desc: 'LINE OA / IG DM 訊息即時觸發 n8n 流程' },
      { title: 'AI 判斷', desc: 'GPT 判斷是否為 FAQ 類問題' },
      { title: '自動回覆', desc: 'FAQ 直接回答，附上相關連結或圖片' },
      { title: '複雜轉人工', desc: '需要判斷的問題標記後轉給真人處理' },
      { title: '記錄對話', desc: '全部對話自動存入 Notion，方便後續分析' },
    ],
    audience: null,
    deliverables: null,
    price: 'NT$ 20,000', priceNote: '依整合平台數量與知識庫規模調整',
    faq: [
      { q: '機器人回答錯誤怎麼辦？', a: '系統設計上遇到不確定的問題會自動轉人工，不會亂回答。上線後也可以持續調整 FAQ 知識庫提升準確率。' },
      { q: '支援哪些訊息平台？', a: '主要支援 LINE 官方帳號（LINE OA）和 Instagram DM，也可評估 Facebook Messenger。' },
      { q: '歷史對話紀錄在哪裡看？', a: '所有對話會自動記錄到 Notion 資料庫，可以依日期、關鍵字篩選查詢，也可以匯出分析。' },
    ],
  },

  {
    slug: 'internal-ai-assistant', index: '06', published: true, kind: 'ai',
    icon: '🧠', cat: '客服與 AI',
    title: '內部知識庫 AI 助理', tagline: 'RAG 接公司文件，問答都在 Slack 內',
    desc: '把公司 SOP、合約模板、過往案例與內部文件餵進向量資料庫（RAG），員工直接在 Slack 或 LINE 提問，AI 只從你的真實文件裡找答案並附上出處，不會亂掰，新人也能更快上手。',
    tags: ['RAG', 'Slack', '向量資料庫', '知識管理'],
    platforms: ['Slack', 'Qdrant', 'Notion API'],
    metric: { before: '15–30 分', after: '< 1 分', label: '查找時間' },
    kpis: [['查找時間', '15–30 分鐘', '< 1 分鐘'], ['新人上手時間', '2 週', '3 天'], ['資料覆蓋', '人工維護', '100% 自動同步']],
    problem: '新人入職花兩週找 SOP、老員工每次都要問同事同樣的問題——公司知識散落在 Notion、Google Drive、信件裡，找資料的時間比做事的時間還多。',
    flowLabel: '系統架構',
    flow: [
      { title: '文件索引', desc: '把公司文件（SOP、合約、FAQ）餵進 Qdrant 向量資料庫' },
      { title: '語意搜尋', desc: '員工在 Slack 輸入問題，系統找最相關的文件段落' },
      { title: 'AI 生成回覆', desc: 'GPT 根據文件內容生成答案，附原始出處' },
      { title: '持續更新', desc: '文件變動時自動重新索引，知識庫永遠是最新的' },
    ],
    audience: null,
    deliverables: null,
    price: 'NT$ 15,000', priceNote: '依文件量、向量庫規模與整合系統數調整',
    faq: [
      { q: '文件格式有限制嗎？', a: '支援 PDF、Word、Google Docs、Notion 頁面，以及 Markdown 文件。只要能匯出文字就能建入知識庫。' },
      { q: 'AI 會不會回答知識庫以外的問題？', a: '不會。系統只從你上傳的文件裡找答案，找不到的會明確回覆「這份資料我沒有」，不會自行編造。' },
      { q: '文件更新了要怎麼辦？', a: '可以設定定期自動同步（如每天重新索引 Notion），或手動觸發更新。文件變動不需要重建整個知識庫。' },
    ],
  },

  {
    slug: 'shopee-daily-order-report', index: '07', published: true, kind: 'product',
    icon: '📦', cat: '自動化產品包',
    title: '每天蝦皮訂單自動統計', tagline: '每天定時算好，業績自己跳出來',
    desc: '用 n8n 自動抓蝦皮訂單，每天定時算好當日筆數、營業額、熱賣商品與待出貨清單，寫進 Google Sheets 並把摘要推到你手機。不用再每天手動匯出 CSV、開 Excel 算總和。',
    tags: ['產品包', 'n8n', 'Google Sheets', '每日報表'],
    platforms: ['n8n', 'Google Sheets', '蝦皮'],
    metric: { before: '每天 20 分鐘', after: '0 分鐘', label: '對帳統計' },
    kpis: [['對帳統計', '20 分', '0 分鐘'], ['更新頻率', '想到才算', '每天定時'], ['看報表', '開 Excel', '手機收摘要']],
    problem: '每天打烊後的固定動作：登入蝦皮、匯出訂單 CSV、開 Excel、拉公式算今天賣了多少、哪個品最好賣——一套做下來 20 分鐘，而且累了還會算錯。更麻煩的是想看趨勢時，過去的數字根本沒留下來。',
    flowLabel: '怎麼運作',
    flow: [
      { title: '抓', desc: 'n8n 定時讀取你的蝦皮訂單匯出檔（CSV）。' },
      { title: '算', desc: '自動計算當日筆數、營業額、客單價、熱賣排行、待出貨清單。' },
      { title: '存', desc: '結果寫進 Google Sheets，每天累積成可回看的歷史趨勢。' },
      { title: '推', desc: '當日摘要發到 LINE / Email，打開手機就看到業績。' },
    ],
    scope: {
      yes: ['單一蝦皮賣場、每日定時統計、歷史數據累積', '一份每日摘要推播'],
      no: ['不含跨平台（蝦皮＋官網＋其他通路）合併報表', '不含即時（每筆訂單觸發）通知，採每日定時'],
    },
    audience: ['每天手動匯出、開 Excel 對帳算業績的蝦皮賣家', '想看每日／每週趨勢，但一直沒把數字留下來的店家'],
    deliverables: ['建置「蝦皮訂單 → 每日自動統計 → Google Sheets」的 n8n 流程', '依你的需求設計報表欄位與分組維度（筆數、營業額、商品排行等）', '每日定時推播當日摘要到 LINE / Email', '交付後操作教學 + 上線 2 週免費調整'],
    price: 'NT$ 3,600', priceNote: '依報表欄位與推播管道估算',
    faq: [
      { q: '蝦皮的訂單資料怎麼進來？', a: '用你每天從蝦皮賣家中心匯出的訂單 CSV 餵進流程，或排程定時讀取你放進指定資料夾／雲端硬碟的檔案。蝦皮沒有公開即時訂單 API，所以採「匯出檔自動處理」這條最穩的路。' },
      { q: '報表可以算哪些數字？', a: '常見的有當日訂單筆數、營業額、平均客單價、熱賣商品排行、待出貨清單。要算什麼欄位、用什麼維度分組，建置前先跟你確認，照你看數字的習慣設計。' },
      { q: '摘要會推到哪裡？', a: '可以發到 LINE、Email 或你常用的通訊軟體，每天固定時間一則當日摘要。完整明細留在 Google Sheets，想細看再點進去。' },
    ],
  },

  {
    slug: 'shopee-listing-from-photo', index: '08', published: true, kind: 'product',
    icon: '📸', cat: '自動化產品包',
    title: '拍照建檔 + 生成蝦皮商品圖', tagline: '拍照就建檔，順手生出蝦皮商品圖',
    desc: '用手機拍下商品標籤，AI 自動辨識品名、規格與條碼，整理成一列寫進 Google Sheets，並生成可直接上架的蝦皮商品圖。一件商品從 30 分鐘縮到 2 分鐘，新品上架不再卡在打字與修圖。',
    tags: ['產品包', 'AI 影像辨識', 'Google Sheets', '商品上架'],
    platforms: ['AI 影像辨識', 'Google Sheets', '蝦皮'],
    metric: { before: '每件 30 分鐘', after: '< 2 分', label: '上架一件' },
    kpis: [['上架一件', '30 分', '< 2 分'], ['辨識建檔', '純手打', '拍照自動'], ['商品圖', '另外修', '一鍵生成']],
    problem: '新品要上蝦皮，最耗時的不是賣，而是前置的瑣事：對著商品標籤一個字一個字打進表格、查條碼、再開修圖軟體把照片去背做成商品主圖。一件商品搞下來半小時跑不掉，品項一多就積在那裡上不完。',
    flowLabel: '怎麼運作',
    flow: [
      { title: '拍', desc: '用手機拍下商品標籤（品名、規格、條碼那一面），可以一次拍一疊。' },
      { title: '辨識', desc: 'AI 影像辨識讀出品名、規格、條碼等欄位，看不清楚的標成「待確認」。' },
      { title: '建檔', desc: '每件商品自動寫成 Google Sheets 的一列，欄位對齊你的上架清單格式。' },
      { title: '生圖', desc: '依你的版型生成蝦皮商品圖（白底去背、加品名／賣點文字），存好等你下載。' },
    ],
    scope: {
      yes: ['標籤可見資訊辨識（品名、規格、條碼等）→ Google Sheets 一列一件', '依固定版型生成符合蝦皮規格的商品主圖'],
      no: ['不含商品文案 SEO 撰寫、不含影片素材', '不含蝦皮後台「自動上架」串接（蝦皮無公開上架 API，採匯出清單）'],
    },
    audience: ['品項多、常上新品，卡在打字建檔與修圖的蝦皮賣家', '想把「拍照→上架」標準化，交給工讀生也能照跑的店家'],
    deliverables: ['建置「拍照標籤 → 商品辨識 → 寫入 Google Sheets」的自動化流程', '設計 1～2 款蝦皮商品圖版型（尺寸、白底、文字位置照你的店風格）', '待確認欄位標記機制，避免 AI 看錯默默填進去', '交付後操作教學 + 上線 2 週免費調整'],
    price: 'NT$ 6,800', priceNote: '依品項欄位與商品圖版型數量估算',
    faq: [
      { q: '我的商品標籤字很小、印刷不清楚也讀得到嗎？', a: '多數情況可以。AI 影像辨識會抓品名、規格、條碼等可見資訊；遇到模糊或缺字的欄位，會在 Google Sheets 標成待確認，讓你補一眼就好，不會默默填錯。' },
      { q: '生成的商品圖能直接上架蝦皮嗎？', a: '可以。輸出會套用你指定的尺寸與版型（去背、白底、加上品名或賣點文字），符合蝦皮主圖規格，下載就能上。版型樣式在建置時先跟你對好。' },
      { q: '我有上百個品項，會很久嗎？', a: '不會一件一件來。拍照可以批次處理，一次丟一疊標籤照進去，AI 逐張辨識、逐列寫進 Sheet、逐張生圖，你只要最後檢查待確認的欄位。' },
    ],
  },

  {
    slug: 'web-development', index: '09', published: true, kind: 'ai',
    icon: '🌐', cat: '軟體開發',
    title: '軟體開發', tagline: 'AI 輔助開發，7 天起交付',
    desc: '用 AI 輔助開發加速交付，Next.js + React 打造 SEO 友善、可串接自動化流程的網站與網頁工具。比傳統報價省一半時間，功能卻不打折。',
    tags: ['Next.js', 'React', 'SEO', '軟體開發', 'Vibe Coding'],
    platforms: ['Next.js', 'React', 'Vite', 'Tailwind CSS', 'Vercel'],
    metric: { before: '3–4 週', after: '7 天起', label: '交付週期' },
    kpis: [['交付週期', '3–4 週', '7 天起'], ['Lighthouse SEO', '基準', '95+'], ['自動化整合', '✕', '✓']],
    problem: '需要一個網站、一個內部用的小工具，或把現有流程包成可以點來點去的網頁——找傳統軟體公司報價動輒六位數、等上一兩個月；找自由接案者又擔心品質參差不齊、後續沒人能接手維護。Vibe Coding 的方式不同：我用 AI 工具處理重複性的程式碼生成，把時間花在架構設計與使用者體驗上，交付乾淨、有結構的 Next.js 程式碼，不是 no-code 拖拉產生的黑盒子。',
    capsLabel: '可以做什麼',
    caps: [
      { title: '網站 / 品牌官網', desc: '形象站、作品集、服務介紹頁，SEO 友善、載入快' },
      { title: '網頁工具 / 內部小系統', desc: '表單、計算機、儀表板、後台管理介面這類「給特定人用」的工具' },
      { title: 'AI 應用前端', desc: '把 Claude / GPT 能力包成可直接操作的網頁（聊天介面、生成工具、批次處理頁）' },
      { title: '既有系統的串接層', desc: '把 n8n、Google Sheets、第三方 API 包成一個有畫面、能操作的介面' },
    ],
    audience: ['個人品牌、自由接案者需要一個有質感的作品集或服務頁', '中小企業需要官網或內部工具，預算有限但不想要套版感', '已有 n8n 自動化流程，想加一個能點選操作、查看結果的前端', '手上有重複性作業，想包成一個網頁工具讓團隊自己用', '舊系統太慢、太難維護，想用現代技術重做'],
    deliverables: ['需求訪談與功能規劃（線上 1 次）', '響應式前端開發（Next.js + React + Tailwind CSS）', '依需求接 API、資料庫或 Google Sheets，輕量需求不過度設計', 'SEO 基礎設定（meta、sitemap、結構化資料、Core Web Vitals 優化）', '部署上線（Vercel / Zeabur，附網域設定說明）', '上線後 2 週免費調整', '基本操作與修改說明文件'],
    addons: ['部落格 / 作品集 CMS（用 MDX 或 Notion 作為後台）', '表單或操作流程串接 n8n 自動通知 / 資料同步', 'Google Analytics 4 + 事件追蹤設定', '多語系（繁中 / 英文）'],
    tiers: [
      { type: '單頁 / 作品集 / 小工具', range: '1–3 頁或單一功能', price: 'NT$ 20,000 起' },
      { type: '多頁網站 / 內部系統', range: '多頁面或含後台', price: 'NT$ 35,000 起' },
      { type: '含自動化 / AI 整合', range: '依需求', price: '另行報價' },
    ],
    price: 'NT$ 20,000', priceNote: '依功能範圍與複雜度調整',
    faq: [
      { q: 'Vibe Coding 是什麼？交付品質有保證嗎？', a: 'Vibe Coding 是用 AI 工具輔助開發的方式——我負責架構設計、邏輯判斷、品質把關，AI 加速重複性的程式碼生成。最終交付的是真實可維護的 Next.js 程式碼，不是 no-code 拖拉產生的黑盒子。' },
      { q: '可以跟我現有的自動化流程整合嗎？', a: '可以。這是我的優勢之一——如果你同時有 n8n 自動化需求（例如表單自動通知、資料同步），可以一起規劃，省去重複溝通的成本。' },
      { q: '交付後我可以自己維護嗎？', a: '可以。程式碼結構清楚，會提供基本的修改說明文件。如果不想自己動，後續維護與功能調整可以按次報價。' },
      { q: '支援哪些部署平台？', a: '預設部署到 Vercel 或 Zeabur，兩者都有免費方案可以起步。有自有伺服器也可以協助設定 Docker 部署。' },
    ],
  },

  {
    slug: 'n8n-ai-hybrid', index: '10', published: false, kind: 'ai',
    icon: '🔗', cat: 'AI 應用',
    title: 'n8n + AI 混合流程', tagline: '在自動化流程裡加入 AI 判斷與內容生成',
    desc: '在現有 n8n 流程裡嵌入 AI 節點，讓重複性判斷、內容生成、資料分類也能自動化——不用重建流程，直接升級。',
    tags: ['n8n', 'AI', '自動化', 'Claude', '混合流程'],
    platforms: ['n8n', 'Claude', 'Groq'],
    metric: null, kpis: null,
    problem: '純自動化流程能搬移資料、觸發動作，但遇到「需要判斷」或「需要生成內容」的步驟就卡住了。加入 AI 節點之後，這些灰色地帶也能自動處理——分類、摘要、草稿、評分，一次到位。',
    capsLabel: '能做什麼',
    caps: [
      { title: '自動分類與標記', desc: '客服信件、表單內容、評論自動分類，不再靠人眼看' },
      { title: 'AI 草稿生成', desc: '觸發事件後自動產生回覆草稿或報告，人工只需最後確認' },
      { title: '摘要與彙整', desc: '每日 / 每週自動抓取資料，用 AI 整理成可讀摘要' },
      { title: '智慧路由', desc: '根據 AI 判斷結果，把不同情境導向不同後續流程' },
    ],
    audience: ['已有 n8n 流程但還有很多「需要人看一眼」的步驟', '內容量大、靠人工分類或摘要效率低的團隊', '想升級現有自動化，不想整個重做'],
    deliverables: ['現有流程審視與 AI 嵌入點分析', 'Claude / Groq API 節點設計與 Prompt 工程', 'n8n 工作流程修改與測試', '上線後 2 週免費調整'],
    price: 'NT$ 15,000', priceNote: '依現有流程複雜度與 AI 節點數量調整',
    faq: [
      { q: '我現有的 n8n 流程要整個重做嗎？', a: '不需要。這個服務是在現有流程基礎上加入 AI 節點，保留原有邏輯，只在適合的步驟嵌入 AI 判斷或生成能力。' },
      { q: 'AI 節點的 API 費用怎麼計算？', a: 'API 費用由你的帳號直接支付給 AI 服務商（如 Anthropic、Groq），我只收建置費。一般 n8n 裡的 AI 節點用量費用很低，我會幫你估算。' },
      { q: '流程裡的 AI 判斷如果出錯怎麼辦？', a: '我會設計錯誤處理機制，當 AI 輸出不符合預期格式時自動 fallback 或通知你。也可以加入人工審核節點作為保險。' },
    ],
  },

  {
    slug: 'ai-chatbot', index: '11', published: false, kind: 'ai',
    icon: '🤖', cat: 'AI 應用',
    title: '客製化 AI 聊天機器人', tagline: 'Claude API 串接，24 小時智慧客服',
    desc: '串接 Claude API，打造符合你品牌語氣的智慧客服或知識庫機器人——自動回應常見問題，讓你的團隊專注在真正需要人處理的事。',
    tags: ['AI', 'Claude', '聊天機器人', '客服自動化'],
    platforms: ['Claude API', 'LINE', 'Messenger'],
    metric: null, kpis: null,
    problem: '客服回覆量大、重複問題多、下班後無人應答——這些問題不需要增加人力，一個訓練好的 AI 機器人可以處理 70% 以上的常見詢問，讓你的團隊專注在真正需要人判斷的事。',
    capsLabel: '能做什麼',
    caps: [
      { title: '品牌知識庫問答', desc: '上傳產品說明、FAQ、政策文件，機器人根據你的資料回答，不亂掰' },
      { title: '多平台部署', desc: '網站嵌入、LINE 官方帳號、Facebook Messenger' },
      { title: '語氣客製化', desc: '可以活潑親切、可以專業正式，完全配合品牌調性' },
      { title: '對話紀錄匯出', desc: '每天整理常見問題，持續優化回應品質' },
    ],
    audience: ['有大量重複性客服詢問的電商或服務業', '想在官網加入即時諮詢但不想 24 小時待機', '需要內部知識庫查詢工具的中小企業'],
    deliverables: ['需求訪談與知識庫資料整理', 'Claude API 串接與 Prompt 工程設計', '前端介面開發或第三方平台整合', '測試調整與上線部署', '上線後 2 週免費優化'],
    price: 'NT$ 20,000', priceNote: '依知識庫規模、整合平台數量調整',
    faq: [
      { q: '機器人會不會亂回答不相關的問題？', a: '不會。我會透過 System Prompt 設計嚴格的邊界，讓機器人只在你提供的知識庫範圍內回答。超出範圍的問題會引導用戶聯絡人工客服。' },
      { q: '知識庫要怎麼提供？', a: '可以是 Word 文件、PDF、Google Docs 或網頁連結，格式不限。我會幫你整理成 AI 能有效使用的格式。' },
      { q: '上線後知識庫可以更新嗎？', a: '可以。依建置方式不同，更新難度也不同。我會設計方便你日後自行維護的架構，或提供更新服務。' },
    ],
  },

  {
    slug: 'ai-frontend-tool', index: '12', published: false, kind: 'ai',
    icon: '⚡', cat: 'AI 應用',
    title: 'AI 前端工具開發', tagline: '把 AI 能力包成可直接使用的網頁工具',
    desc: '用 Vibe Coding 快速開發 AI 驅動的網頁工具，讓你的用戶不需要懂 API，開啟就能用——從概念到上線，快速交付。',
    tags: ['AI', '前端開發', 'Claude', '工具開發'],
    platforms: ['Next.js', 'Claude', 'Groq'],
    metric: null, kpis: null,
    problem: '你有一個 AI 使用情境，但不知道怎麼包成產品讓別人用。或者你的內部流程需要一個 AI 輔助介面，但不想花大錢找外包公司，也不想等三個月。',
    capsLabel: '能做什麼',
    caps: [
      { title: '內部 AI 工具', desc: '幫團隊做的生成工具、審核輔助、資料彙整介面' },
      { title: '對外 SaaS 雛形', desc: '有 AI 功能的 MVP，快速驗證市場' },
      { title: '品牌 AI 體驗', desc: '嵌入官網的 AI 功能，提升用戶互動（如智慧推薦、個人化內容）' },
      { title: '工具站風格頁面', desc: '多個 AI 小工具集合，直接給用戶使用' },
    ],
    audience: ['有 AI 使用構想但缺乏開發資源的團隊', '想快速做出 AI 功能 MVP 驗證想法的創業者', '需要內部 AI 工具但不想走完整軟體開發流程的企業'],
    deliverables: ['需求訪談與功能規格確認', 'UI/UX 設計與前端開發（Next.js）', 'Claude / Groq API 整合與 Prompt 設計', '速率限制、錯誤處理等生產級設定', '部署上線與操作說明'],
    price: 'NT$ 25,000', priceNote: '依功能複雜度、頁面數量、API 用量設計調整',
    faq: [
      { q: '我不懂技術，可以說清楚需求嗎？', a: '可以用你熟悉的方式描述，不需要技術語言。我會在需求訪談中用問題引導你把構想說清楚，再轉換成開發規格。' },
      { q: '做出來的工具我可以自己維護嗎？', a: '程式碼完整交付，你可以找其他開發者維護。也可以找我簽維護合約，由我持續更新和優化。' },
      { q: 'AI API 費用大概多少？', a: '以 Claude Sonnet 為例，一般使用量（數百次對話/天）每月約 USD 10–50 不等，依實際用量而定。我會在開發前幫你估算預期用量。' },
    ],
  },

  {
    slug: 'ai-prompt-consulting', index: '13', published: false, kind: 'ai',
    icon: '🎯', cat: 'AI 應用',
    title: 'AI 提示詞工程顧問', tagline: '設計、測試、優化讓 AI 穩定輸出的提示詞',
    desc: '幫你設計與優化 AI 提示詞，解決輸出不穩定、格式亂跑、回答偏離需求的問題——讓 AI 每次都給你想要的結果。',
    tags: ['Prompt Engineering', 'Claude', 'AI 顧問', '提示詞'],
    platforms: ['Claude', 'GPT', 'Prompt Engineering'],
    metric: null, kpis: null,
    problem: '同樣的問題，換個問法結果差很多——這不是 AI 的問題，是提示詞設計的問題。很多團隊在導入 AI 工具後發現輸出不穩定、格式亂、答非所問，根本原因幾乎都出在 Prompt 上。',
    capsLabel: '能做什麼',
    caps: [
      { title: '系統提示詞設計', desc: '針對你的使用情境，設計完整的 System Prompt，定義角色、輸出格式、邊界條件' },
      { title: '輸出格式標準化', desc: '讓 AI 每次都輸出 JSON、固定格式文字或結構化清單，接進系統不再要清洗資料' },
      { title: 'Few-shot 範例工程', desc: '用精選範例引導模型，大幅提升準確率' },
      { title: '多輪對話設計', desc: '設計有記憶、有狀態的對話流程' },
      { title: '跨模型移植', desc: 'Claude → GPT 或反向，調整 Prompt 讓效果對齊' },
    ],
    audience: ['正在導入 AI 但覺得輸出品質不穩定的團隊', '開發者需要讓 AI 輸出能直接接入程式，不想手動清洗', '想讓 AI 工具產出更符合品牌語氣的行銷或客服團隊'],
    deliverables: ['現有 Prompt 審查與問題診斷', '新 Prompt 設計與多版本測試', '測試報告與優化建議文件', '一次線上同步說明（60 分鐘）'],
    price: 'NT$ 8,000', priceNote: '依使用情境數量與測試規模調整',
    faq: [
      { q: '我不知道問題出在哪，只覺得 AI 輸出怪怪的，也可以找你嗎？', a: '可以。把你目前使用的 Prompt 和覺得不對的輸出範例給我，我幫你診斷問題所在，再提出優化方向。' },
      { q: '優化後的 Prompt 有保固嗎？', a: '交付的 Prompt 會附上測試報告，說明在哪些情境下有效、哪些邊界案例需要注意。後續微調可以視需求另外報價。' },
      { q: '這個服務適合完全不懂 AI 的人嗎？', a: '適合。你不需要懂技術，只需要清楚說明你想要 AI 做什麼、不想要它做什麼，其餘的交給我設計和測試。' },
    ],
  },
]

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return SERVICES_DETAIL.find((s) => s.slug === slug)
}

// Published services in index order — used for prev/next so navigation
// never points at a draft (non-routed) page.
export function getPublishedServicesInOrder(): ServiceDetail[] {
  return SERVICES_DETAIL.filter((s) => s.published).sort((a, b) => a.index.localeCompare(b.index))
}
