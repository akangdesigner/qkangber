import Link from 'next/link'
import type { Service } from '@/types/content'

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block rounded-xl p-6 flex flex-col transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* gradient border on hover */}
      <div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.5), rgba(34,211,238,0.3))' }}
      />
      <div
        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: '#0a0b14', margin: '1px' }}
      />

      <div className="relative flex items-start justify-between gap-4 mb-4">
        <span className="text-3xl">{service.icon}</span>
        {service.featured && (
          <span
            className="text-[0.65rem] tracking-[0.18em] uppercase font-semibold rounded-full px-2.5 py-0.5"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#a78bfa',
            }}
          >
            熱門
          </span>
        )}
      </div>

      <div className="relative mb-1">
        <span className="text-[0.7rem] tracking-[0.15em] uppercase text-slate-500 font-medium">
          {service.category}
        </span>
      </div>

      <h3 className="relative text-lg font-semibold text-white mb-3 leading-snug group-hover:text-violet-300 transition-colors duration-150 tracking-[-0.01em]">
        {service.title}
      </h3>

      <p className="relative text-sm text-slate-400 leading-relaxed flex-1 mb-5">
        {service.description}
      </p>

      <div className="relative flex items-center justify-between">
        <div>
          <span className="text-lg font-semibold text-white">
            NT$ {service.price.toLocaleString()}
          </span>
          {service.priceNote && (
            <span className="text-sm text-slate-500 ml-1">{service.priceNote}</span>
          )}
        </div>
        <span
          className="text-sm font-medium group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1"
          style={{ color: '#a78bfa' }}
        >
          了解詳情 →
        </span>
      </div>
    </Link>
  )
}
