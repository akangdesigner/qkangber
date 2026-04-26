export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  excerpt: string
  coverImage?: string
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
