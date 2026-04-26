export function readingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(wordCount / wordsPerMinute))
  return `${minutes} 分鐘閱讀`
}
