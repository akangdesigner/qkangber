'use client'
import { useState, useEffect } from 'react'

/**
 * SSR-safe media query hook. Returns false on the server / first paint, then
 * resolves to the real value after mount. Use for inline-styled client
 * components that can't express responsive breakpoints in CSS.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Convenience: true when viewport is at or below the mobile breakpoint (640px). */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 640px)')
}
