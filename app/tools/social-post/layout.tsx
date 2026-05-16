import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '社群貼文產生器',
  description: '輸入主題，AI 幫你寫好 Threads、Instagram、Facebook 貼文與標籤。免費使用，不需要註冊。',
  alternates: { canonical: 'https://aiqkangber.com/tools/social-post' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
