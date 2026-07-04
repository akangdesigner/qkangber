import { buildMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { jsonLdScript } from '@/lib/jsonld'

export const metadata = buildMetadata({
  title: 'AI 是什麼？n8n 能做什麼？AI 自動化常見問題',
  description: '什麼是 AI、AI Agent、RAG、MCP？n8n 能幫企業做什麼？整理 AI 與自動化最常被問的問題，用白話一次說清楚——從觀念、實際應用到導入企業。',
  keywords: ['ai 是什麼', '人工智慧定義', 'n8n 是什麼', 'ai 應用', 'rag 是什麼', 'ai agent 是什麼', 'mcp 是什麼'],
  path: '/faq',
})

const BASE_URL = 'https://aiqkangber.com'

type FaqItem = { q: string; a: string; list?: string[]; after?: string; link?: { href: string; label: string } }
type FaqCategory = { category: string; items: FaqItem[] }

const faqs: FaqCategory[] = [
  {
    category: 'AI 基礎觀念',
    items: [
      {
        q: '什麼是 AI（人工智慧）？簡單講它能做什麼',
        a: 'AI（人工智慧）是讓電腦模仿人類「理解、判斷、生成」能力的技術。換句話說，人工智慧的定義，就是讓機器具備原本只有人才有的理解與生成能力。現在大家在用的 ChatGPT、Claude 這類生成式 AI，本質是讀過海量文字後，能聽懂你的話、幫你寫文章、寫程式、分析資料、回答問題。對企業來說重點不是「AI 多聰明」，而是它能把原本要人花時間做的重複腦力工作——分類郵件、整理報表、回覆客服、草擬文案——接手處理。你負責出題和把關，它負責把量做出來。',
      },
      {
        q: 'AI 可以幫企業做什麼？有哪些用途和實際應用例子？',
        a: 'AI 最實際的幾類用途是：',
        list: [
          '客服自動回覆：讀懂問題，從你的資料庫找答案',
          '文件與報表整理：把雜亂的訂單、發票、Email 變成結構化資料',
          '內容生成：產品描述、社群貼文、電子報草稿',
          '資料分析：從一堆數字裡抓出趨勢和異常',
        ],
        after: '以電商為例，最常見的是訂單自動匯入、自動對帳、客訴自動分類派工。判斷一個應用值不值得做，看「這件事每天／每週重複幾次」——越高頻、越規則化，自動化的回報越大。',
      },
      {
        q: 'AI Agent 是什麼？和一般 AI 聊天機器人差在哪？',
        a: '一般聊天機器人是「你問一句、它答一句」，每次都要你下完整指令。AI Agent 則是你給它一個「目標」，它會自己拆步驟、決定用哪些工具、呼叫幾次，直到完成。差別在它有「推理＋使用工具」的能力——能自己查資料、讀資料庫、呼叫 API、再把結果丟回去判斷。例如你說「把這週訂單對帳並寄報表給會計」，聊天機器人只會教你怎麼做，AI Agent 會真的去抓訂單、比對、產報表、寄信。代價是設計門檻高、要控制它別亂跑，所以實務上先從單一明確任務做起。',
      },
      {
        q: '生成式 AI、LLM 是什麼？和以前的 AI 有什麼不同？',
        a: 'LLM（大型語言模型）是生成式 AI 的核心，ChatGPT、Claude 都屬於這類。它讀過海量文字後學會「預測下一個字」，所以能寫文章、回答問題、寫程式。和以前的 AI 最大的差別是：傳統 AI 多半只能做單一任務（辨識貓狗、分類垃圾信），你得先幫它定義規則或標好答案；生成式 AI 則是同一個模型就能跨任務——寫信、翻譯、摘要、寫程式都行，而且用自然語言下指令就好。對企業來說，這代表導入門檻大幅降低，很多原本要客製開發的功能，現在用對提示詞就能先做出雛形。',
      },
      {
        q: 'AI 會取代我的工作嗎？',
        a: '比較務實的講法是：AI 不會直接取代你，但會取代「不用 AI 的人手上那部分重複工作」。AI 擅長高頻、有規則、產出量大的任務——草擬文案、整理資料、初步分類；它不擅長需要經驗判斷、跨部門協調、要為結果負責的事。所以與其擔心被取代，更實際的是把它當成放大器：讓它接手你最花時間的瑣事，你把省下的時間放到判斷和決策上。真正會被拉開差距的，是「會用 AI」和「不會用」的人，而不是人和 AI。',
      },
      {
        q: '什麼是 AI 幻覺（hallucination）？它會亂講嗎？',
        a: '會。AI 幻覺指的是模型「一本正經地講出看似合理、實際上卻錯誤或捏造」的內容——例如編出不存在的法條、引用假的數據或網址。原因是 LLM 本質是在「預測最像答案的文字」，不是真的「知道」事實。實務上有三招可以壓低風險：',
        list: [
          '接 RAG：只根據你提供的資料回答，並附上出處方便查證',
          '設計提示詞：明確要求它「不確定就說不知道」',
          '人工把關：重要結果一定有人覆核才送出',
        ],
        after: '簡單說，AI 適合當草稿和助手，但別把它的輸出當成已查證的事實直接用。',
      },
    ],
  },
  {
    category: 'n8n 工作流自動化',
    items: [
      {
        q: 'n8n 是什麼？可以拿來做什麼？',
        a: 'n8n 是一套「工作流程自動化」工具，把不同軟體服務串在一起，讓資料自動在它們之間流動。你用拖拉節點的方式設計流程：某件事發生（例如收到一筆蝦皮訂單）→ 自動做下一步（寫進 Google Sheets → 通知 Slack → 寄確認信）。常見用途：訂單匯入、自動對帳、客服分流、定時抓報表、把 AI 接進流程裡自動分類或回覆。n8n 最大的特色是可以「自架（self-hosted）」，資料完全在你自己的伺服器上、不經過第三方，而且開源版本免費。',
      },
      {
        q: 'n8n 和 Zapier、Make 有什麼差別？',
        a: '三者都是把服務串起來的自動化工具，最大差別在「資料放哪」和「費用結構」。Zapier、Make 是訂閱制雲端服務，上手快，但任務量一大費用很快飛起來，資料也會經過它們的伺服器。n8n 可以自架，資料完全留在你自己手上，開源版免費，量再大也不按次收費。流程會碰敏感資料（個資、訂單、財務）或任務量高、想長期省成本，n8n 自架幾乎是唯一划算解；只是輕量偶爾跑，Zapier、Make 上手更快。',
      },
      {
        q: '沒有寫程式基礎，也能用 n8n 嗎？',
        a: '基本流程可以。n8n 是視覺化拖拉介面，常見串接（表單→試算表、訂單→通知、定時抓資料）點一點就能完成，不用寫 code。但老實說，當流程變複雜（資料格式要轉換、串沒有現成節點的 API、加判斷邏輯），會碰到需要寫一點 JavaScript 或看懂 API 文件的地方。務實的態度是「簡單的自己做、複雜的找人做或先學」。想自己上手，建議從一個真實小痛點開始（例如把表單回覆自動整理進試算表），做出來最有感、也學得最快。',
      },
      {
        q: 'n8n 是免費的嗎？費用怎麼算？',
        a: 'n8n 有兩種用法。一是「自架（self-hosted）」，用開源的 Community 版本，軟體本身免費，你只要付自己伺服器的費用（一台小主機月租幾百塊就能跑），流程跑再多也不額外收費。二是官方的「n8n Cloud」，免架設、開箱即用，但按方案和執行量訂閱收費。差別在於：自架省錢、資料自己掌握，但要會基本的伺服器維護；Cloud 省事，適合不想碰主機的人。我的接案大多走自架，長期成本最低，資料也完全留在你手上。',
      },
      {
        q: 'n8n 自架和 n8n Cloud 差在哪？該選哪個？',
        a: '核心差別是「誰來顧主機」和「資料放哪」：',
        list: [
          '自架（self-hosted）：免授權費、資料不出門、能裝社群節點、客製空間大，代價是要自己負責更新和備份',
          'n8n Cloud：官方代管、打開就能用、自動更新，但要訂閱付費、執行量有上限，資料也會經過它的伺服器',
        ],
        after: '判斷原則：流程會碰個資、財務這類敏感資料，或量大想長期省成本，選自架；只是輕量、偶爾跑、不想管技術細節，Cloud 上手最快。',
      },
      {
        q: '把訂單、客戶資料交給 n8n 跑，安全嗎？',
        a: '自架的話，安全性其實掌握在你自己手上——資料完全留在你的伺服器、不經過任何第三方，這正是很多企業選 n8n 而非雲端 SaaS 的主因。要顧好的是基本功：伺服器設好權限與防火牆、憑證（API key、密碼）用 n8n 內建的 Credentials 加密保存而不是寫死在流程裡、定期更新版本。這些我在交付時都會一起設定好，並教你怎麼維護。相比把資料丟給國外 SaaS，自架反而更可控。',
      },
    ],
  },
  {
    category: 'AI 導入與資料應用',
    items: [
      {
        q: 'RAG 是什麼？對企業有什麼用？',
        a: 'RAG（檢索增強生成）白話講就是「讓 AI 回答前，先去翻你的專屬資料庫」。一般 AI 只會用訓練時學過的通用知識，不知道你公司內部的東西。RAG 的做法是：先把你的文件（產品手冊、SOP、客服紀錄）建成可搜尋的知識庫，使用者一問，系統先找出最相關的段落，再讓 AI 根據那些段落回答。好處是答案有憑有據、可隨時更新（換文件就好，不用重訓模型），也不會像通用 AI 那樣亂編。企業最常拿來做內部知識問答、客服助理、新人查詢。',
      },
      {
        q: '公司的內部資料，能不能變成 AI 問答助理？',
        a: '可以，這正是 RAG 最典型的應用。做法是把你的資料（PDF、Word、試算表、網站內容、甚至過往 Email）整理、切段、建成向量知識庫，再接上對話介面，員工或客人就能用自然語言問、它從你的資料裡找答案。重點不在技術多炫，而在三件事：',
        list: [
          '資料要夠乾淨：垃圾進、垃圾出',
          '答案要能附來源：方便回頭查證',
          '設好「查不到就老實說不知道」：避免亂答',
        ],
        after: '這類內部 AI 問答助理是我常接的案子之一，想做可以直接聊需求。',
      },
      {
        q: '向量資料庫是什麼？為什麼做 AI 問答會用到？',
        a: '向量資料庫是專門用來「依語意找相似內容」的資料庫。它把每段文字轉成一串數字（向量），意思相近的文字、數字也會靠得近。所以使用者問問題時，系統能用「語意」而不是「關鍵字」去找最相關的段落——就算用詞完全不同也找得到。這正是 RAG（讓 AI 根據你的資料回答）的關鍵零件。常見的有 pgvector、Pinecone、Qdrant，各有適合的場景；資料量不大時，用 PostgreSQL 加 pgvector 通常最省事又夠用。',
      },
      {
        q: 'RAG 和 fine-tuning（微調）差在哪？我該用哪個？',
        a: '兩者都是讓 AI「更懂你的東西」，但路線不同。RAG 是回答前先去翻你的資料庫、根據查到的內容作答，知識靠外掛——換文件就好，更新快、答案能附出處、成本低，適合常變動的知識（產品資訊、SOP、客服紀錄）。Fine-tuning 是拿你的資料去「再訓練」模型，把知識和風格寫進模型本身，適合要它學特定語氣、格式或專業判斷，但成本高、資料一變就得重訓。多數企業需求用 RAG 就解決了；想要固定語氣或專業風格時，才考慮兩者搭配。',
      },
      {
        q: '把公司內部資料給 AI，會不會外洩或被拿去訓練？',
        a: '這取決於你用哪種架構。把資料丟進公開的免費版 AI 工具，確實有被當成訓練資料的風險；但企業導入的正規做法不是這樣：',
        list: [
          '用 API 串接：OpenAI、Anthropic 的 API 都載明不會拿企業資料訓練',
          '知識庫放自己的環境：AI 只在回答當下「讀取」相關片段，不會被吸收進模型',
        ],
        after: '再加上權限控制和「查不到就不答」的設計，內部 AI 助理是可以做到安全可控的。我在規劃時會把資料邊界和權限一起設計進去。',
      },
      {
        q: 'MCP 是什麼？跟一般的 AI 串接差在哪？',
        a: 'MCP（Model Context Protocol）是 Anthropic 在 2024 年底發布的開放標準，可以把它想成「AI 的 USB-C 接口」：以前要讓 AI 讀你的資料、操作你的工具，每家服務都得各寫一套串接；有了 MCP，工具端只要做一個 MCP server，任何支援 MCP 的 AI（像 Claude）就都能直接接上使用。差別在角色反轉——一般 API 串接是「你寫程式去呼叫 AI」，MCP 是「讓 AI 自己伸手去用你的工具」：它可以直接讀你的 Figma 設計稿、操作你的 n8n 工作流、查你的資料庫，而不是只回給你一段建議文字。對企業來說，這代表 AI 從「顧問」變成「能動手的同事」。',
        link: { href: '/blog/claude-mcp', label: 'MCP 是什麼？讓 Claude 不只給建議、還能直接動手改你的 Figma 和 n8n' },
      },
      {
        q: '提示詞工程（Prompt Engineering）是什麼？真的有差嗎？',
        a: '提示詞工程就是「把需求講清楚到 AI 能穩定做對」的方法。同一個模型，含糊地問和結構化地問，產出品質可以差很多——好的提示詞會交代角色、目標、限制、輸出格式，必要時附上範例（few-shot）引導它。差別在哪？臨時用一次，隨便問也還好；但要把 AI 接進每天要跑的流程、要求結果穩定可預期，提示詞設計就是成敗關鍵。我接的 AI 應用案，很大一部分工夫其實花在這裡：把提示詞調到「換不同輸入也不會跑掉」。',
      },
    ],
  },
  {
    category: '自動化觀念',
    items: [
      {
        q: '自動化的 ROI 怎麼算？大概多久回本？',
        a: '最簡單的算法，就是把兩筆帳放一起比：',
        list: [
          '現在的成本：這件事每週花多少人力時間 × 時薪，就是你每週在燒的錢',
          '自動化的成本：一次性的建置費用 ＋ 後續維護',
        ],
        after: '舉例，一個流程每天手動做 1 小時、一週 5 小時，自動化後幾乎歸零，省下的人力時間累積幾個月通常就蓋過建置費。越高頻、越耗時、越容易出錯（出錯還要花時間補救）的流程，回本越快；一個月才做一兩次的事，CP 值就低。我在需求訪談時會先幫你抓這筆帳，划不來的我會直接說。',
      },
      {
        q: '哪些事「不該」自動化？',
        a: '三種情況我會建議先別急著自動化：',
        list: [
          '每次都不一樣、要靠人判斷的事：規則無法明確化，硬自動化反而容易出錯',
          '頻率很低的事：一年跑兩次，花時間建流程不划算',
          '流程本身還沒理順的事：把一個混亂的流程自動化，只會更快地製造混亂',
        ],
        after: '務實的順序是：先把流程理清楚、規則寫明白、確認它高頻又穩定，再來自動化。自動化是放大器，前提是你放大的東西本身是對的。',
      },
    ],
  },
  {
    category: '合作與服務',
    items: [
      {
        q: '怎麼開始合作？',
        a: '直接寄信到 asdtodd42@gmail.com，或透過頁面底部的「免費諮詢」。我會在 1–2 個工作天內回覆，安排一次免費的線上需求訪談（約 30–60 分鐘），先把你的問題和目標聊清楚，再判斷適不適合自動化、怎麼做最划算。',
      },
      {
        q: '定價怎麼算？',
        a: '每個專案依整合系統數量、複雜度、功能範圍報「固定價」，不是按時計費，你事先就知道總花費、不會做到一半被加價。服務頁面上的價格為起始參考價，實際報價在需求訪談、確認範圍後給你。',
      },
      {
        q: '從諮詢到上線大概要多久？',
        a: '依專案複雜度而定，一般 n8n 流程自動化約 1–3 週，AI 應用開發約 2–6 週。需求訪談後會提供更準確的時程與分階段規劃，讓你清楚每階段交付什麼。',
      },
      {
        q: '上線後如果有問題怎麼辦？',
        a: '上線後有 2 週免費調整期，期間發現的問題免費修復。之後可以選擇維護合約，或依實際狀況按次報價，不綁長約。',
      },
    ],
  },
]

export default function FaqPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: [item.a, item.list?.join('；'), item.after].filter(Boolean).join(' '),
        },
      }))
    ),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'AI × 自動化指南', item: `${BASE_URL}/faq` },
    ],
  }

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(124,92,255,0.08), transparent 60%)' }}
      />

      <nav aria-label="breadcrumb" className="mb-8">
        <ol className="flex items-center gap-1.5 text-sm text-slate-500">
          <li><Link href="/" className="hover:text-slate-300 transition-colors">首頁</Link></li>
          <li><span className="text-slate-700">/</span></li>
          <li><span className="text-slate-300">AI × 自動化指南</span></li>
        </ol>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8 flex-shrink-0" style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }} />
        <span
          className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
          style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Technical Guide
        </span>
      </div>

      <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-3">AI × 自動化指南</h1>
      <p className="text-slate-400 mb-14">
        AI、n8n、自動化最常被問的問題，用白話講清楚。有其他問題歡迎
        <a href="mailto:asdtodd42@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors ml-1">直接問我</a>。
      </p>

      <div className="space-y-14">
        {faqs.map((cat) => (
          <section key={cat.category}>
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-3">
              <span>{cat.category}</span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </h2>
            <div className="space-y-4">
              {cat.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl overflow-hidden"
                  style={{ background: '#0d0e1a', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-white font-medium text-sm select-none hover:text-violet-300 transition-colors">
                    {item.q}
                    <span className="text-slate-500 group-open:rotate-180 transition-transform duration-200 flex-shrink-0">▾</span>
                  </summary>
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                    {item.list && (
                      <ul className="mt-3 space-y-2">
                        {item.list.map((li) => {
                          const ci = li.indexOf('：')
                          const label = ci > -1 ? li.slice(0, ci + 1) : null
                          const rest = ci > -1 ? li.slice(ci + 1) : li
                          return (
                            <li key={li} className="flex gap-2.5 text-sm text-slate-400 leading-relaxed">
                              <span className="text-violet-400 mt-px flex-shrink-0">•</span>
                              <span>
                                {label && <span className="text-slate-200 font-medium">{label}</span>}
                                {rest}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {item.after && (
                      <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.after}</p>
                    )}
                    {item.link && (
                      <p className="mt-3 text-sm leading-relaxed">
                        <Link href={item.link.href} className="text-violet-400 hover:text-violet-300 transition-colors">
                          延伸閱讀：{item.link.label}
                        </Link>
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm text-slate-500">
          想直接讓人幫你做？{' '}
          <Link href="/services" className="text-violet-400 hover:text-violet-300 transition-colors">查看服務項目</Link>
          {' '}或{' '}
          <a href="mailto:asdtodd42@gmail.com" className="text-violet-400 hover:text-violet-300 transition-colors">免費諮詢</a>。
        </p>
      </div>
    </div>
  )
}
