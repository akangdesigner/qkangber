import Link from 'next/link'
import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  a: ({ href = '', children, ...props }) => {
    if (href.startsWith('http')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    }
    return <Link href={href} {...props}>{children}</Link>
  },

  img: ({ src = '', alt = '', ...props }) => (
    <span className="block my-8 rounded-xl overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={800}
        height={450}
        className="w-full h-auto"
        {...(props as object)}
      />
    </span>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-8 pl-6 text-slate-400 leading-relaxed text-lg italic"
      style={{ borderLeft: '2px solid #8b5cf6' }}>
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 overflow-x-auto text-[13px] font-mono text-violet-200 my-6">
      {children}
    </pre>
  ),
}
