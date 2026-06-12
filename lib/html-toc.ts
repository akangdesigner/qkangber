// 內文 HTML 來自 Google Sheets，文章本身不寫目錄區塊；渲染前掃 h2/h3 抽出標題清單、
// 補上錨點 id，文章頁用它自動產生「文章目錄」（轉貼到方格子等平台時，平台有自己的自動目錄）。
export type TocItem = { level: 2 | 3; text: string; id: string }

export function extractToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  let counter = 0
  const out = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, lvl, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    if (!text) return full
    counter += 1
    const idMatch = attrs.match(/\bid\s*=\s*"([^"]+)"/i)
    const id = idMatch ? idMatch[1] : `toc-${counter}`
    toc.push({ level: Number(lvl) as 2 | 3, text, id })
    if (idMatch) return full
    return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`
  })
  return { html: out, toc }
}
