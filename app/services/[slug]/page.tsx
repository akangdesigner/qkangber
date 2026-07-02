import { notFound } from 'next/navigation'
import { getAllServices, getServiceBySlug } from '@/lib/mdx'
import {
  SERVICES_DETAIL,
  getServiceDetail,
  getPublishedServicesInOrder,
} from '@/lib/services-detail'
import ServiceDetailView from '@/components/services/ServiceDetailView'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ slug: string }> }

const BASE_URL = 'https://aiqkangber.com'

export async function generateStaticParams() {
  const services = await getAllServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!getServiceDetail(slug)?.published) return {}
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return buildMetadata({
    title: service.title,
    description: service.description,
    ...(service.keywords ? { keywords: service.keywords } : {}),
    path: `/services/${slug}`,
  })
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const svc = getServiceDetail(slug)
  if (!svc || !svc.published) notFound()

  // SEO from the MDX frontmatter (unchanged source of truth for metadata).
  const service = await getServiceBySlug(slug)

  const faqJsonLd = service?.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: service.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
    : null

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service?.title ?? svc.title,
    description: service?.description ?? svc.desc,
    provider: { '@type': 'Person', name: 'Q kangber', url: BASE_URL },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TWD',
      ...(service?.price ? { price: service.price } : {}),
    },
  }

  // prev/next cycle through published services only (drafts have no route).
  const published = getPublishedServicesInOrder()
  const pIdx = published.findIndex((s) => s.slug === svc.slug)
  const ring = pIdx >= 0 ? published : [svc]
  const ringIdx = pIdx >= 0 ? pIdx : 0
  const prevSvc = ring[(ringIdx - 1 + ring.length) % ring.length]
  const nextSvc = ring[(ringIdx + 1) % ring.length]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <ServiceDetailView
        svc={svc}
        total={SERVICES_DETAIL.length}
        prev={{ slug: prevSvc.slug, index: prevSvc.index, title: prevSvc.title }}
        next={{ slug: nextSvc.slug, index: nextSvc.index, title: nextSvc.title }}
      />
    </>
  )
}
