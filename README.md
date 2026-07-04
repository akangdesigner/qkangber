# Q kangber 官網（aiqkangber.com）

Q kangber 個人品牌官網：n8n 自動化服務、AI 應用開發作品集、技術部落格與每週電子報。

## 技術棧

- **Next.js 16**（App Router）+ React 19 + TypeScript
- **Tailwind CSS v4**
- **部署**：Zeabur（`zbpack.json` 鎖 Node 20，非 Vercel）
- **內容來源**：
  - 部落格文章與電子報 → Google Sheets「電子報」表的 posts 分頁（HTML 格式，`lib/sheets.ts` 經 API 讀取，60s revalidate）
  - 服務內頁 → 硬編 `lib/services-detail.ts`（`content/services/*.mdx` 供列表/sitemap 用，兩邊要同步）
  - 聊天機器人知識庫 → `robot.md`（服務異動要跟著更新）
  - `public/llms.txt` → 手動維護，只列 published:true 的服務

## 本機開發

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 正式建置
npx tsc --noEmit   # 型別檢查
npm run lint       # ESLint
```

環境變數放 `.env.local`（不進版控），需要的 key 見 `.env.local.example`。

## 目錄速覽

| 路徑 | 用途 |
|------|------|
| `app/` | 頁面與 API routes（admin 後台、chat、contact、subscribe、pet-talk 等） |
| `components/` | UI 元件（home / portfolio / services / chat / effects…） |
| `lib/` | 資料層與共用邏輯（sheets、mdx、metadata、admin-auth、rate-limit） |
| `content/services/` | 服務 MDX（frontmatter 驅動列表與 sitemap） |
| `scripts/` | 發布與維運腳本（見下） |
| `docs/` | 寫作規範（anti-ai-style.md）、SVG 示意圖範本 |
| `blog-drafts/` | 文章草稿（不進版控） |

## 常用腳本

- `scripts/publish-<slug>.mjs`：把 blog-drafts 的 HTML 轉官網格式後寫進 Sheets posts 分頁（預設 dry-run，`--write` 才寫入）
- `scripts/check-ai-style.mjs <草稿路徑>`：交稿前的去 AI 味自檢
- `scripts/gsc-query-report.mjs`：GSC 原生 API 查搜尋數據
- `scripts/upload-imgbb.mjs`：內文圖轉 webp 上 ImgBB
- `scripts/audit-internal-links.mjs`：全站內鏈圖譜稽核（孤兒/死巷）

## 寫作與 SEO 規範

見 `CLAUDE.md`（TKD + EEAT 原則、RWD 規則）與 `docs/anti-ai-style.md`。
