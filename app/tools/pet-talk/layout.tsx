import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '寵物溝通師 — AI 幫你解讀毛孩的內心世界',
  description: '上傳毛孩照片，AI 化身量子靈魂感應師，用一本正經的偽科學替你解讀牠在想什麼——免費，不用註冊。',
  keywords: ['寵物溝通師', 'AI 寵物', '毛孩心聲', '免費 AI 工具'],
  alternates: { canonical: 'https://aiqkangber.com/tools/pet-talk' },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '寵物溝通師',
    description: '上傳毛孩照片，AI 以量子靈魂感應術解讀牠的心聲。免費使用，不需要註冊。',
    url: 'https://aiqkangber.com/tools/pet-talk',
    applicationCategory: 'EntertainmentApplication',
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
      { '@type': 'ListItem', position: 3, name: '寵物溝通師', item: 'https://aiqkangber.com/tools/pet-talk' },
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
