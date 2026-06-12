// 內文 HTML 來自 Google Sheets，<img> 標籤不經 next/image，瀏覽器預設會全部搶先載入。
// 渲染前統一補上 loading="lazy" / decoding="async"；第一張圖通常在首屏（LCP 候選），維持 eager。
export function lazifyContentImages(html: string): string {
  let imgIndex = 0
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    imgIndex += 1
    if (imgIndex === 1) return tag
    let out = tag
    if (!/\bdecoding\s*=/i.test(out)) out = out.replace(/^<img/i, '<img decoding="async"')
    if (!/\bloading\s*=/i.test(out)) out = out.replace(/^<img/i, '<img loading="lazy"')
    return out
  })
}
