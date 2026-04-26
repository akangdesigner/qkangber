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
    <blockquote className="border-l-4 border-[var(--color-accent)] pl-5 my-6 text-[var(--color-text-muted)] italic not-italic">
      {children}
    </blockquote>
  ),
}
