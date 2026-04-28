import Link from 'next/link'
import ServiceCard from '@/components/services/ServiceCard'
import { getAllServices } from '@/lib/mdx'

export default async function ServicesPreview() {
  const services = await getAllServices()
  const featured = services.filter((s) => s.featured).slice(0, 2)
  const preview = featured.length >= 2 ? featured : services.slice(0, 2)

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 border-t border-[#e7e5e4]">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-[#ea580c]" />
            <span className="text-[0.68rem] tracking-[0.22em] uppercase text-[#ea580c] font-semibold">
              服務項目
            </span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#1c1917]">熱門自動化服務</h2>
        </div>
        <Link
          href="/services"
          className="text-sm text-[#78716c] hover:text-[#ea580c] transition-colors duration-150 group inline-flex items-center gap-1"
        >
          查看全部
          <span className="group-hover:translate-x-0.5 transition-transform duration-150 inline-block">→</span>
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
