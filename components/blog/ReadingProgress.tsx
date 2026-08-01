'use client'

import { useEffect, useState } from 'react'

/**
 * 文章頁頂端的 2px 閱讀進度條。
 *
 * 進度只算「內文區塊」不算整份 document——內文底下還有相關文章、上下篇、
 * 作者卡跟全站 Footer，用 document 高度算的話讀完內文才走到七成，數字是錯的。
 */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0

    const measure = () => {
      raf = 0
      const el = document.getElementById(targetId)
      // 找不到目標（例如 MDX 路徑改版）就退回整份 document，不要整條壞掉
      const top = el ? el.getBoundingClientRect().top + window.scrollY : 0
      const height = el ? el.offsetHeight : document.documentElement.scrollHeight
      if (height <= 0) {
        setProgress(1)
        return
      }
      // 視窗底緣當「讀到哪」，走到內文底部剛好 100%
      const read = window.scrollY + window.innerHeight - top
      setProgress(Math.min(1, Math.max(0, read / height)))
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [targetId])

  return (
    // Nav 是 sticky z-50，這條疊在它上緣（Nav 內容垂直置中，2px 蓋不到東西）
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 h-[2px] z-[60] bg-white/[0.06]"
    >
      <div
        className="h-full"
        style={{
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
          boxShadow: '0 0 12px rgba(139,92,246,0.6)',
        }}
      />
    </div>
  )
}
