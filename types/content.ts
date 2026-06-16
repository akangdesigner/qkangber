export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  excerpt: string
  coverImage?: string
  category?: string
  subCategory?: string
  featured?: boolean
}

export interface Post extends PostFrontmatter {
  slug: string
  readingTime: string
}

export interface PostWithContent extends Post {
  content: string
}

export interface ServiceFrontmatter {
  title: string
  description: string
  keywords?: string[]
  price: number
  priceNote?: string
  category: string
  tags: string[]
  icon: string
  featured: boolean
  published: boolean
  serviceType?: 'automation' | 'ai' | 'product'
  faq?: { q: string; a: string }[]
  subtitle?: string
  accent?: string
  accent2?: string
  platforms?: string[]
  metric?: { before: string; after: string; label: string }
  kpis?: [string, string, string][]
  previewImage?: string
}

export interface Service extends ServiceFrontmatter {
  slug: string
}

export interface ServiceWithContent extends Service {
  content: string
}

export interface Course {
  title: string
  description: string
  platform: string
  price: string
  link: string
}
