export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  excerpt: string
  coverImage?: string
  category?: string
  featured?: boolean
}

export interface Post extends PostFrontmatter {
  slug: string
  readingTime: string
}

export interface PostWithContent extends Post {
  content: string
}

export interface CourseFrontmatter {
  title: string
  description: string
  platform: string
  link: string
  price: string
  coverImage?: string
  published: boolean
}

export interface Course extends CourseFrontmatter {
  slug: string
}

export interface ServiceFrontmatter {
  title: string
  description: string
  price: number
  priceNote?: string
  category: string
  tags: string[]
  icon: string
  featured: boolean
  published: boolean
  serviceType?: 'automation' | 'ai'
  faq?: { q: string; a: string }[]
}

export interface Service extends ServiceFrontmatter {
  slug: string
}

export interface ServiceWithContent extends Service {
  content: string
}
