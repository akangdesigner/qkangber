import Image from 'next/image'
import Link from 'next/link'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import StatusTag from '@/components/activities/StatusTag'
import { buildMetadata } from '@/lib/metadata'
import { jsonLdScript } from '@/lib/jsonld'

export const metadata = buildMetadata({
  title: { absolute: 'Claude 實戰訓練營 12 週上課紀錄 — Q kangber 活動分享' },
  description:
    'Claude 實戰訓練營逐週紀錄：12 週用 VIBE Coding 把一個解決自己真實困擾的網頁工具從想法做到上線，每週更新上課內容與現場照片。',
  path: '/activities/claude-camp-2026',
  ogTitle: 'Claude 實戰訓練營 12 週上課紀錄',
  ogSubtitle: '實體＋線上混成班，每週更新上課內容',
  ogBadge: '上課紀錄',
  type: 'article',
  publishedTime: '2026-07-18',
  authors: ['Q kangber'],
})

const BASE_PATH = '/activities/claude-camp-2026'
const MONO = 'var(--font-jetbrains), ui-monospace, monospace'

// 12 週課程表（濃縮自課綱）
const SYLLABUS: { week: string; tool: string; title: string }[] = [
  { week: 'W1', tool: 'Chat', title: 'Chat 基礎與專案啟動' },
  { week: 'W2', tool: 'Chat', title: '用 AI 產出產品規劃（PRD）' },
  { week: 'W3', tool: 'Cowork＋Design', title: '建專屬知識庫與產品視覺框架' },
  { week: 'W4', tool: 'Artifacts', title: '做出前端畫面（一）' },
  { week: 'W5', tool: 'Artifacts', title: '做出前端畫面（二）' },
  { week: 'W6', tool: 'Artifacts', title: '前端細節美化與 RWD' },
  { week: 'W7', tool: 'Claude Code', title: '進階邏輯與資料運算' },
  { week: 'W8', tool: 'n8n', title: '工具串接：第一條工作流' },
  { week: 'W9', tool: 'n8n＋Supabase', title: '接資料庫，產品記得住資料' },
  { week: 'W10', tool: 'Code＋MCP', title: '全棧整合與第三方 API' },
  { week: 'W11', tool: 'Code＋Zeabur', title: '整合測試與部署上線' },
  { week: 'W12', tool: 'Demo Day', title: '成果發表' },
]

type WeekPhoto = { src: string; alt: string; caption: string; pos?: string }

// 上課現場照片，放在 hero 不綁單一週次
const PHOTOS: WeekPhoto[] = [
  {
    src: '/activities/claude-camp-w2-live.webp',
    alt: 'Claude 實戰訓練營實體課現場，學員各自用筆電跟著操作，投影幕正在講角色設定',
    caption: '實體教室：投影幕上是「差一句角色設定，回答天差地遠」的對照示範',
    pos: 'center 45%',
  },
  {
    src: '/activities/claude-camp-w2-online.webp',
    alt: 'Claude 實戰訓練營線上同步畫面，Google Meet 分享當週簡報，多位學員同時在線',
    caption: '線上同步：Google Meet 直播上半場簡報，線上學員即時跟課',
  },
]

// 知識點底下附的範本：fields 是「標籤｜內容」逐行，code 是原樣呈現的片段
type Example =
  | { kind: 'fields'; label: string; rows: { k: string; v: string }[] }
  | { kind: 'code'; label: string; lines: string[] }

type Note = { heading: string; body: string; example?: Example }
type Half = { label: string; title: string; notes: Note[] }
type WeekLog = {
  week: string
  date: string
  title: string
  intro: string
  halves: Half[]
}

// 逐週紀錄：新的一週加在陣列最前面
const LOGS: WeekLog[] = [
  {
    week: 'W3',
    date: '2026-08-01',
    title: '幫 AI 建一個記得住專案的知識庫',
    intro:
      'AI 每次開新對話都不認得你的專案。它本來就沒有記憶，要補回來得分兩層：短期靠上下文視窗，長期把知識寫成檔案放在外面。至於用 AI 做出來的網站為什麼長得都一樣，問題不在模型強不強，在於沒有人替它決定風格。',
    halves: [
      {
        label: 'Memory',
        title: 'AI 為什麼會忘記，以及記憶怎麼補回來',
        notes: [
          {
            heading: '它沒有記憶，每一輪都把對話重讀一次',
            body: '模型本身不累積任何東西。你每送出一句話，它是把目前看得到的整段對話從第一句重讀一遍，再猜下一個字。所以「它記得我」是假象，記得的是那份被重讀的紀錄，不是模型；紀錄沒帶進來，它就什麼都不知道。對話越長，每一輪要重讀的量越大，變慢變貴跟模型退步無關。',
          },
          {
            heading: '上下文視窗是記憶體，不是硬碟',
            body: '文字進模型前會先切成 token，一次能塞進去的 token 有上限，這個上限就是上下文視窗。Claude 主力的幾顆模型目前是 100 萬 token，中文一個字大約吃掉 1 到 2 個。它的角色跟記憶體一樣：裝得下現在正在處理的東西，塞爆之後最舊的先被擠出去，對話一關就清空。要長期留住的東西，得寫在外面的檔案裡。',
          },
          {
            heading: '塞得進去，不等於它看得清楚',
            body: 'Lost in the Middle 這篇研究把同一個答案藏在一疊文件的不同位置，再問模型同一題，答對率呈 U 型：放最前面或最後面高，要它去中間拿明顯掉下來，連專為長文本設計的模型也一樣。所以最重要的規則要寫進 System Prompt，它固定排在最前面、每一輪都被重新讀一次，不要埋進你貼上去的一堆文件中間。',
          },
          {
            heading: '長期記憶分三種，知識庫補的是語意那塊',
            body: '情節記憶記的是發生過的對話與事件，語意記憶記的是事實、規格、專屬知識，程序記憶記的是事情該照什麼步驟做。上傳 PRD、頁面清單這類文件補的是語意記憶；程序記憶靠協作規則寫進 System Prompt，情節記憶靠自己留紀錄。',
          },
          {
            heading: '知識庫檔案選 .md，是因為它沒東西可以掉',
            body: '.docx 的內容混在排版指令裡，抽成文字時表格最常被抽壞；.pdf 記的是「這個字印在第幾公分」而不是結構，兩欄排版容易被抽成左右交錯的亂序。Markdown 本身就是純文字，結構寫在 #、-、** 這些符號裡，你打開看到的就是模型讀到的。它又是 GitHub 與技術文件的通用寫法，模型看過的量遠比其他格式多，也不用花視窗位子去放樣式碼。',
            example: {
              kind: 'code',
              label: '需求包.md：記事本就打得開，六個符號夠用九成',
              lines: [
                '# 排課小幫手',
                '',
                '## 第一版不做的事',
                '- 金流串接',
                '- 多人共用行事曆',
                '',
                '## 核心使用者',
                '**獨立接案的才藝老師**，手上 20 個學生以內，',
                '現在用 LINE 訊息加紙本記出席。',
              ],
            },
          },
          {
            heading: 'RAG 是檢索、增強、生成三個動作',
            body: '文件先照標題切成一段一段，每段算成一組座標存進向量資料庫；提問時只把意思最接近的幾段撈進視窗，整份文件不進去。比對的是意思不是字面，所以你問「首頁該放幾個按鈕」，線框裡寫的是「主要操作有三個」也撈得到，關鍵字搜尋在這裡會直接漏掉。',
          },
          {
            heading: '三個訊號出現，才輪得到 RAG',
            body: '一份文件就裝不下、答案散在很多份檔案、常常抓錯段落，這三個訊號都還沒出現之前，Markdown 知識庫就夠用。兩者差在知識量上限、更新成本，以及出錯時好不好查：改 Markdown 是直接改檔案，RAG 出錯還要先分辨是切段切壞還是比對抓錯。Cowork 的知識庫把檔案直接附進對話，站的就是 Markdown 這一端。',
          },
        ],
      },
      {
        label: 'Design',
        title: '六個產業長出同一個網站，因為沒有人做設計決定',
        notes: [
          {
            heading: '六個產業，六個風格標籤，同一組零件',
            body: '六個不相干的行業各自描述自己的需求，跑出來的風格標籤沒有一個重複，但每一張都找得到同樣四樣東西：頂端徽章、漸層大標、三欄卡片、藥丸按鈕。換掉的是外皮，骨架沒動。技術上它沒做錯什麼，排版整齊、配色也沒衝突，問題在於沒有人替它決定骨架。',
          },
          {
            heading: '沒給方向，它就挑看過最多次的那一組',
            body: '叫模型做網頁跟叫它接話是同一件事，只是這次猜的是下一個版面。Tailwind、Shadcn UI 這些在訓練資料裡出現過幾百萬次，你的品牌配色它一次都沒看過，機率會往哪邊倒是可以預測的。反過來說，只要是你刻意做過的決定，它就不再是 AI 味。決定得好不好是另一回事，先有決定才有差別。',
          },
          {
            heading: '需求文件只講完一半',
            body: 'PRD、User Story、頁面清單、文字線框回答的是內容與結構：給誰用、要能做什麼、有幾頁、每一塊放什麼。視覺方向那一半一個字都沒寫到：想要什麼調性、有沒有現成色票與 logo、參考哪個網站、誰在什麼裝置上打開。只給前半，它就只能挑統計上最安全的那組零件。',
          },
          {
            heading: '五行講完，它就不用猜',
            body: '目標、版面、內容、受眾、風格，一行一句。前三行需求文件裡都有，抄過去就好；第五行的「不要」通常比「要」有用，因為它擋掉的正是模型看過最多次的那組零件。像是「不要三張一樣寬的卡」「不要寫訂閱人數」，講明了它就不會端出來。',
            example: {
              kind: 'fields',
              label: '給設計工具的五行範本（填好的樣子）',
              rows: [
                { k: '目標', v: '一頁服務頁，給我的 n8n 自動化接案用' },
                { k: '版面', v: 'hero、服務模式列、案例、聯絡，由上到下' },
                { k: '內容', v: 'hero 放一句主張加一張工作流示意圖；模式列分自動化與 AI 應用兩種，各列服務項目' },
                { k: '受眾', v: '中小企業的老闆或窗口，來看這個人能幫我做什麼' },
                { k: '風格', v: '深色底、青綠重點色、等寬字當標籤；不要置中三張一樣寬的卡' },
              ],
            },
          },
          {
            heading: '設計決定要放在寫程式之前',
            body: '設計工具決定長什麼樣，Claude Code 負責讓它動，兩邊的弱項剛好互補。差別只在順序：設計放前面，Code 照著做；設計放後面，前面寫好的畫面全部要重來。交付過去的不是截圖，是一包結構化的規格：元件規格、design tokens、版面層級、素材，Code 讀到的是數字，不用猜像素。',
          },
          {
            heading: 'Design tokens 是把設計決定寫成數字',
            body: '哪幾個顏色、字級跳幾階、間距用哪幾個數、圓角多少，全部定成明確的值。定下來之後每一頁都照這組長，不用每做一頁就重開設計工具描述一次品牌長什麼樣，團隊也才有辦法維護同一套。',
          },
          {
            heading: '它做得出版面，做不出插畫',
            body: '版面配置、排版、配色和 SVG 線條圖、簡單幾何形狀是守備範圍；複雜插畫、真實照片、高質感主視覺不是，這類素材得另外找圖庫或自己準備，在裡面硬拗只會燒額度。新圖示、重點插畫、產品與按鈕的命名這三樣自己來比較快，交給它會拿到很安全也很無聊的詞。',
          },
        ],
      },
    ],
  },
  {
    week: 'W2',
    date: '2026-07-25',
    title: '讓 Claude 成為你的產品經理',
    intro:
      '模型會聽話是被訓練出來的，會附和你也是。搞懂這個反射從哪裡來，才知道為什麼要替它掛上一個會挑戰你的人格；再往下就是把腦中的構想寫成別人看得懂、自己驗收得了的需求文件。',
    halves: [
      {
        label: 'Training',
        title: '模型怎麼被訓練成聽話，又為什麼老是附和你',
        notes: [
          {
            heading: '後訓練三階段',
            body: '預訓練讀完資料只是把話學會，後面還有三關：SFT 看師傅示範標準答案、獎勵模型學會分辨回答的好壞、RLHF 讓模型自己練到出師。Claude 多一層憲法（Constitutional AI），把行為準則寫成明文再讓它照著自我修正。',
          },
          {
            heading: '把通用模型變成專才，有三條路',
            body: '微調是動模型本身，成本最高；角色設定是用一段 System Prompt 指定它的身分與立場；餵資料是把專屬知識放進知識庫或 RAG。後兩條不用碰模型，現在就做得到，效果也足夠應付大多數場景。',
          },
          {
            heading: '它附和你，是訓練出來的反射',
            body: '獎勵模型偏好讓人滿意的回答，所以直接問「你覺得如何」，得到的多半是稱讚。要它挑毛病，得在提示詞裡指定一個會挑戰假設的角色，明講要它找出沒寫到的地方。把構想書丟給一個毒舌產品經理，戳中的正是自己不想面對的那幾格。',
            example: {
              kind: 'code',
              label: '把它換成會挑戰你的人格',
              lines: [
                '你是一位看過 20 個專案倒在半路的產品經理，說話直接。',
                '我貼一份構想書給你，請挑出三個最可能讓它失敗的假設，',
                '每一個都反問我一個問題，答不出來就代表我還沒想清楚。',
                '',
                '不要稱讚，不要幫我補完我沒寫的部分，',
                '也不要提出解法，這一輪只負責問。',
              ],
            },
          },
        ],
      },
      {
        label: 'Spec',
        title: '動工前把需求寫到能驗收',
        notes: [
          {
            heading: '先寫成品長什麼樣，再開工',
            body: 'Amazon 的做法是新產品動工前先寫一份對外新聞稿：講不清楚賣點就代表還沒想清楚。六格 PRD 是同一個邏輯的縮小版，把要做給誰、解決什麼問題、第一版做到哪裡先寫死，後面每一個功能爭議都回這張表判定。',
          },
          {
            heading: 'User Story 三格句型',
            body: '身為（具體的誰）、我想要（做一件具體的事）、這樣就能（得到一個好處）。第一格防的是做給想像中的人用，第二格防的是功能寫得太籠統沒辦法驗收，第三格防的是做完才發現對使用者沒有意義。',
            example: {
              kind: 'fields',
              label: '一張卡片填起來長這樣',
              rows: [
                { k: '身為', v: '手上 20 個學生以內、用 LINE 收排課訊息的才藝老師' },
                { k: '我想要', v: '把一整串 LINE 訊息一次貼進輸入框' },
                { k: '這樣就能', v: '不用一則一則手抄進紙本課表' },
              ],
            },
          },
          {
            heading: 'MoSCoW 把功能分四疊',
            body: 'Must、Should、Could、Won’t，第一版只做第一疊。難的不是分類，是逼自己承認哪些是 Won’t。沒有這一疊，範圍會一路長大到做不完。',
          },
          {
            heading: '文字線框：錯在紙上很便宜',
            body: '迪士尼 1933 年就在用分鏡牆，先把每一格畫面釘在牆上排順序，錯了撕掉重畫。文字線框是同一件事的低成本版：每一頁由上到下哪裡放什麼、寫什麼字、按了會去哪，全部先用文字講清楚。這時候改一行字，比畫面做出來再改便宜太多。',
          },
        ],
      },
    ],
  },
  {
    week: 'W1',
    date: '2026-07-18',
    title: 'Chat 基本應用與專案啟動',
    intro:
      '大模型只做一件事：根據前文猜下一個字。理解這句話之後，提示詞為什麼要寫角色、背景、任務、格式，它為什麼會一本正經地講錯，全部都有了解釋。',
    halves: [
      {
        label: 'Basics',
        title: '模型在做什麼，以及怎麼跟它把話講清楚',
        notes: [
          {
            heading: '它讀完整座圖書館，但從來沒出過門',
            body: '模型讀了十幾兆字、帶著幾千億個參數，能做的仍然只有一件事：看前文，挑機率最高的下一個字接下去。它沒有查證管道，也沒有真的理解你的處境。講得流利跟講得正確是兩回事。',
          },
          {
            heading: '提示詞四件套',
            body: '角色決定它站在什麼立場回答、背景給它判斷用的前提、任務講明要它做什麼、格式規定產出長什麼樣。四件事缺一件，它就自己補一個機率最高的版本，落差多半就從這裡來。再往上有三招：給範例、要求它先追問再動筆、要求它先想再答。',
            example: {
              kind: 'fields',
              label: '四件套填起來長這樣',
              rows: [
                { k: '角色', v: '你是一位帶過十年新人的行銷主管，說話直接。' },
                { k: '背景', v: '我是行銷企劃，明天要報告這季廣告成效，主管最在意花掉的預算換到什麼。' },
                { k: '任務', v: '把我貼的數據整理成三個重點，每個重點後面附一句主管可能追問的問題。' },
                { k: '格式', v: '條列三點，每點兩句以內，不要開場白也不要總結。' },
              ],
            },
          },
          {
            heading: '幻覺是猜下一個字的副作用',
            body: '猜下一個字的機制不會因為「不知道」就停下來，遇到資料裡沒有的東西一樣接得很順。四個防法：把資料貼給它再問、明講只能根據給的內容回答、明確允許它說不知道、重要的資訊自己交叉驗證。',
            example: {
              kind: 'code',
              label: '把它關進你給的資料裡',
              lines: [
                '只根據我貼在下面的資料回答。',
                '資料裡沒有寫到的，直接回「資料裡沒有」，',
                '不要用一般常識補，也不要猜。',
                '',
                '每個結論後面標出你是從第幾段推出來的。',
              ],
            },
          },
        ],
      },
      {
        label: 'Workflow',
        title: 'VIBE Coding 與 Claude 各個工具的分工',
        notes: [
          {
            heading: '意圖引導優於語法記憶',
            body: 'VIBE Coding 的分工是：你負責想清楚要什麼、把話講明白、判斷做出來的東西好不好，程式讓 AI 寫。不寫程式的人卡住的地方通常不是語法，是需求沒想清楚，而那一段 AI 幫不了你。',
          },
          {
            heading: '六個工具，各守一段工作流',
            body: 'Chat 用來想清楚與討論，Projects 放專屬知識庫，Design 決定產品長什麼樣，Artifacts 產出馬上點得動的成品，Claude Code 負責實作與部署，Cowork 讓代理自己跑完多步驟的任務。知道手上這件事該切到哪一個工具，比六個都學會有用。',
          },
        ],
      },
    ],
  },
]

function ExampleCard({ example }: { example: Example }) {
  return (
    <div className="mt-3.5 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(124,92,255,0.2)', background: 'rgba(6,8,18,0.55)' }}>
      <p
        className="m-0 px-4 py-2"
        style={{ fontFamily: MONO, fontSize: '0.68rem', letterSpacing: '0.08em', color: '#a78bfa', borderBottom: '1px solid rgba(124,92,255,0.16)', background: 'rgba(124,92,255,0.07)' }}
      >
        {example.label}
      </p>
      {example.kind === 'fields' ? (
        <div className="p-4 flex flex-col gap-2.5">
          {example.rows.map((r) => (
            <div key={r.k} className="flex gap-3">
              <span className="shrink-0 pt-[3px]" style={{ fontFamily: MONO, fontSize: '0.72rem', fontWeight: 700, color: '#c4b5fd', width: '3.6rem' }}>{r.k}</span>
              <span className="text-[0.85rem] sm:text-[0.875rem] leading-[1.8] text-slate-300">{r.v}</span>
            </div>
          ))}
        </div>
      ) : (
        <pre className="m-0 p-4 overflow-x-auto text-[0.8rem] sm:text-[0.85rem] leading-[1.9] text-slate-300" style={{ fontFamily: MONO, whiteSpace: 'pre-wrap' }}>
          {example.lines.join('\n')}
        </pre>
      )}
    </div>
  )
}

export default function ClaudeCamp2026Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Claude 實戰訓練營 12 週上課紀錄',
    description:
      'Claude 實戰訓練營逐週紀錄：12 週用 VIBE Coding 把一個解決自己真實困擾的網頁工具從想法做到上線，每週更新上課內容與現場照片。',
    url: `https://aiqkangber.com${BASE_PATH}`,
    datePublished: '2026-07-18',
    dateModified: '2026-08-01',
    author: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
      sameAs: [
        'https://www.threads.com/@q_kangber',
        'https://www.instagram.com/q_kangber',
      ],
    },
    publisher: { '@type': 'Person', name: 'Q kangber', url: 'https://aiqkangber.com' },
  }

  return (
    <main className="relative overflow-hidden pb-16 sm:pb-24">
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,92,255,0.16), transparent 60%)' }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.03 }} />

      <div className="max-w-[940px] mx-auto px-4 sm:px-6 pt-12 sm:pt-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
        <Breadcrumbs crumbs={[
          { label: '首頁', href: '/' },
          { label: '活動分享', href: '/activities' },
          { label: 'Claude 實戰訓練營' },
        ]} />

        {/* hero */}
        <header className="mb-12 sm:mb-16">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full" style={{ padding: '6px 15px', border: '1px solid rgba(124,92,255,0.3)', background: 'rgba(124,92,255,0.07)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#c4b5fd' }}>
              Claude Bootcamp
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.12] mb-5">
            Claude 實戰訓練營<br className="hidden sm:block" /> 12 週上課紀錄
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-[58ch] text-base sm:text-[1.0625rem]">
            課程一句話：不寫程式的人，用 12 週把一個解決自己真實困擾的網頁工具從想法做到上線，並在 Demo Day 發表。方法論是 VIBE Coding，用意圖引導 AI，不是背語法。這頁逐週記錄每次上課講了什麼，跟著課程一路更新到 W12。
          </p>
          <p className="mt-6" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em', color: '#475569', margin: '24px 0 0' }}>
            <span style={{ color: '#a78bfa' }}>2026.07.18 開課</span><span style={{ color: '#334155' }}>·</span>
            <span>XLab AI 實驗室</span><span style={{ color: '#334155' }}>·</span>
            <span>每週 3 小時</span><span style={{ color: '#334155' }}>·</span>
            <span>實體＋線上混成班</span><span style={{ color: '#334155' }}>·</span>
            <span><span style={{ color: '#c4b5fd' }}>{LOGS.length}</span> / 12 週已記錄</span>
          </p>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PHOTOS.map((p) => (
              <figure key={p.src} className="m-0">
                <div className="overflow-hidden rounded-xl border border-white/[0.08]" style={{ aspectRatio: '16/10', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="relative w-full h-full">
                    <Image src={p.src} alt={p.alt} fill sizes="(max-width: 640px) 100vw, 450px" priority style={{ objectFit: 'cover', objectPosition: p.pos || 'center' }} />
                  </div>
                </div>
                <figcaption className="mt-2 text-[0.78rem] leading-relaxed text-slate-500">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </header>

        {/* 12 週課程表 */}
        <section className="mb-12 sm:mb-16">
          <h2 className="m-0 mb-5 text-xl sm:text-2xl font-semibold text-white tracking-[-0.015em]">12 週在做什麼</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SYLLABUS.map((s) => {
              const logged = LOGS.some((l) => l.week === s.week)
              return (
                <div key={s.week} className="rounded-xl p-3.5 border" style={{ borderColor: logged ? 'rgba(124,92,255,0.35)' : 'rgba(255,255,255,0.08)', background: logged ? 'rgba(124,92,255,0.06)' : 'rgba(255,255,255,0.02)' }}>
                  <p className="m-0 mb-1 flex items-center gap-2">
                    <span style={{ fontFamily: MONO, fontSize: '0.72rem', fontWeight: 700, color: logged ? '#a78bfa' : '#64748b' }}>{s.week}</span>
                    <span style={{ fontFamily: MONO, fontSize: '0.62rem', letterSpacing: '0.05em', color: '#475569' }}>{s.tool}</span>
                  </p>
                  <p className="m-0 text-[0.82rem] leading-snug" style={{ color: logged ? '#e2e8f0' : '#94a3b8' }}>{s.title}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 逐週紀錄 */}
        <section>
          <h2 className="m-0 mb-8 text-xl sm:text-2xl font-semibold text-white tracking-[-0.015em]">逐週紀錄</h2>
          <div className="flex flex-col gap-12 sm:gap-16">
            {LOGS.map((log) => (
              <article key={log.week} className="rounded-2xl p-5 sm:p-8 border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span style={{ fontFamily: MONO, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', color: '#7c5cff' }}>{log.week}</span>
                  <StatusTag tone="muted">{log.date.replaceAll('-', '.')}</StatusTag>
                </div>
                <h3 className="m-0 mb-3 text-lg sm:text-2xl font-semibold text-slate-100 tracking-[-0.015em] leading-snug">{log.title}</h3>
                <p className="m-0 text-[0.95rem] sm:text-base leading-[1.9] text-slate-300">{log.intro}</p>

                <div className="mt-8 flex flex-col gap-8">
                  {log.halves.map((half) => (
                    <section key={half.label}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pb-3 mb-5 border-b border-white/[0.08]">
                        <span style={{ fontFamily: MONO, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', color: '#a78bfa' }}>
                          {half.label.toUpperCase()}
                        </span>
                        <h4 className="m-0 text-[1.0625rem] sm:text-lg font-semibold text-white tracking-[-0.01em] leading-snug">{half.title}</h4>
                      </div>
                      <div className="flex flex-col gap-5">
                        {half.notes.map((n) => (
                          <div key={n.heading}>
                            <h5 className="m-0 mb-1.5 text-[0.95rem] font-semibold leading-snug" style={{ color: '#c4b5fd' }}>{n.heading}</h5>
                            <p className="m-0 text-[0.9rem] sm:text-[0.95rem] leading-[1.95] text-slate-400">{n.body}</p>
                            {n.example && <ExampleCard example={n.example} />}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 結尾 CTA */}
        <div className="mt-14 sm:mt-20 rounded-2xl p-6 sm:p-8 text-center" style={{ border: '1px solid rgba(124,92,255,0.22)', background: 'rgba(124,92,255,0.05)' }}>
          <p className="m-0 mb-5 text-slate-300 leading-relaxed text-[0.95rem] sm:text-base">
            課程還在進行中，每週上完課就會更新這頁。想了解報名資訊可以到 XLab 活動官網看下一梯的時間。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <Link href="/activities" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
              回活動分享
            </Link>
            <a href="https://www.xlab.com.tw/events" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              XLab 活動官網
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
            <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm" style={{ color: '#93c5fd' }}>
              逛 AI × n8n 知識庫
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
