import type { Metadata } from 'next'

// robots.txt only blocks crawling; noindex is what keeps /admin out of the index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
