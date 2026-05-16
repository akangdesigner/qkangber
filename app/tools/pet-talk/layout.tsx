import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '寵物溝通師',
  description: '上傳毛孩照片，AI 以量子靈魂感應術解讀牠的心聲。免費使用，不需要註冊。',
  alternates: { canonical: 'https://aiqkangber.com/tools/pet-talk' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
