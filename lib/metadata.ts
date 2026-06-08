import type { Metadata } from 'next'

export const SITE_URL = 'https://aiqkangber.com'
export const SITE_NAME = 'Q kangber'
const DEFAULT_OG_IMAGE = '/opengraph-image'

// Google 桌面約顯示 155-160 字元就截斷，Ahrefs 也把 >160 標為「too long」。
// 統一在 155 收斂並補省略號，避免任何頁面（多見於電子報 summary／長 excerpt）描述過長。
// 只影響 <head> 的 meta／OG，畫面上的摘要文字仍直接取自原始來源、不受影響。
const MAX_DESCRIPTION = 155

function clampDescription(text: string): string {
  const chars = [...text] // 以 code point 切，避免切壞表情符號等代理對
  if (chars.length <= MAX_DESCRIPTION) return text
  return chars.slice(0, MAX_DESCRIPTION).join('').trimEnd() + '…'
}

type BuildMetadataInput = {
  /** 字串會套用 layout 的 title template；要繞過 template 就傳 { absolute } */
  title: string | { absolute: string }
  description: string
  /** 以 '/' 開頭的頁面路徑，例如 '/about'、`/blog/${slug}`；首頁傳 '/' */
  path: string
  keywords?: string[]
  /** OG 圖；預設用站台的 /opengraph-image */
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  authors?: string[]
}

/**
 * 產生完整且一致的頁面 metadata。
 *
 * 重點：這版 Next.js 對 openGraph 是「整包覆蓋、不深層合併」(generate-metadata.md L1326-1358)，
 * 所以每頁都必須自帶完整的 openGraph。本函式保證：
 *   1. og:url === canonical（修掉 Ahrefs「OG URL 不符 canonical」）
 *   2. og:title / og:description / og:image / og:url / siteName / locale 一律齊全（修掉「OG 不完整」）
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  authors,
}: BuildMetadataInput): Metadata {
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`
  const ogTitle = typeof title === 'string' ? title : title.absolute
  const metaDescription = clampDescription(description)

  const openGraph = {
    type,
    locale: 'zh_TW',
    url,
    siteName: SITE_NAME,
    title: ogTitle,
    description: metaDescription,
    images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
    ...(publishedTime ? { publishedTime } : {}),
    ...(authors ? { authors } : {}),
  } as Metadata['openGraph']

  return {
    title,
    description: metaDescription,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: metaDescription,
      images: [image],
    },
  }
}
