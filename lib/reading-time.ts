export function readingTime(content: string): string {
  // 先去掉 HTML 標籤，只算實際內文
  const text = content.replace(/<[^>]+>/g, ' ')
  // 中文（含日文假名）逐字算；英數照「詞」算——中文沒有空白，不能用 split(/\s+/)
  const cjkChars = (text.match(/[一-鿿぀-ヿ가-힯]/g) || []).length
  const latinWords = (text.replace(/[一-鿿぀-ヿ가-힯]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length
  // 中文約 350 字/分、英數約 200 詞/分
  const minutes = Math.max(1, Math.round(cjkChars / 350 + latinWords / 200))
  return `${minutes} 分鐘閱讀`
}
