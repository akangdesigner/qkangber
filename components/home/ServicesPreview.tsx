import Link from 'next/link'
import ServiceCard from '@/components/services/ServiceCard'
import { getAllServices } from '@/lib/mdx'

export default async function ServicesPreview() {
  const services = await getAllServices()
  const featured = services.filter((s) => s.featured).slice(0, 2)
  const preview = featured.length >= 2 ? featured : services.slice(0, 2)

  return (
    <section className="relative max-w-5xl mx-auto px-6 py-20 border-t border-white/[0.05]">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-px w-7 flex-shrink-0"
              style={{ background: 'linear-gradient(90deg, transparent, #7c5cff)' }}
            />
            <span
              className="text-[0.66rem] tracking-[0.28em] uppercase font-semibold"
              style={{
                background: 'linear-gradient(90deg,#a78bfa,#60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Services
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-white tracking-[-0.015em]">熱門自動化服務</h2>
        </div>
        <Link
          href="/services"
          className="text-sm text-slate-400 hover:text-white transition-colors duration-150 group"
        >
          查看全部{' '}
          <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {preview.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </section>
  )
}
