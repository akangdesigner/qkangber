import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML 文章編輯器 + 圖片嵌入工具',
  description: '貼入 HTML 文章、上傳圖片自動轉 base64 嵌入，複製後直接發布到方格子等內容平台。免費使用，不需要註冊。',
  alternates: { canonical: 'https://aiqkangber.com/tools/html-editor' },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HTML 文章編輯器 + 圖片嵌入工具',
    description: '貼入 HTML 文章、上傳圖片自動轉 base64 嵌入，複製後直接發布到方格子等內容平台。',
    url: 'https://aiqkangber.com/tools/html-editor',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
    author: {
      '@type': 'Person',
      name: 'Q kangber',
      url: 'https://aiqkangber.com/about',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: 'https://aiqkangber.com' },
      { '@type': 'ListItem', position: 2, name: '工具站', item: 'https://aiqkangber.com/tools' },
      { '@type': 'ListItem', position: 3, name: 'HTML 文章編輯器', item: 'https://aiqkangber.com/tools/html-editor' },
    ],
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
