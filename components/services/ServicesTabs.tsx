'use client'

import { useState } from 'react'
import type { Service } from '@/types/content'
import ServiceCard from './ServiceCard'
import ServiceFlow from './ServiceFlow'

type Props = {
  automationServices: Service[]
  aiServices: Service[]
}

const TABS = [
  { id: 'automation', label: '⚙️ n8n 自動化' },
  { id: 'ai', label: '✨ AI 應用' },
] as const

type TabId = typeof TABS[number]['id']

export default function ServicesTabs({ automationServices, aiServices }: Props) {
  const [active, setActive] = useState<TabId>('automation')

  const automationCategories = [...new Set(automationServices.map((s) => s.category))]

  return (
    <>
      {/* Tab列 */}
      <div className="flex gap-1 mb-10 rounded-xl p-1 w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="relative px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: isActive ? '#ffffff' : '#94a3b8',
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
            >
              {isActive && (
                <span
                  className="absolute inset-x-4 bottom-1.5 h-px rounded-full"
                  style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa)' }}
                />
              )}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* n8n 自動化 Tab */}
      {active === 'automation' && (
        <>
          <div
            className="rounded-2xl border border-white/[0.08] p-4 sm:p-6 mb-14 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                workflow.json · live
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
            </div>
            <ServiceFlow services={automationServices} />
          </div>

          {automationCategories.map((cat) => {
            const catServices = automationServices.filter((s) => s.category === cat)
            return (
              <div key={cat} className="mb-14">
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-3">
                  <span>{cat}</span>
                  <span className="h-px flex-1 bg-white/[0.06]" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {catServices.map((service) => (
                    <ServiceCard key={service.slug} service={service} />
                  ))}
                </div>
              </div>
            )
          })}
        </>
      )}

      {/* AI 應用 Tab */}
      {active === 'ai' && (
        <>
          <div className="mb-10 max-w-xl">
            <p className="text-slate-400 leading-relaxed">
              使用 Claude 系列模型，幫你把 AI 能力包進產品、流程與工具裡。不只是 Prompt，而是從需求到上線的完整交付。
            </p>
          </div>

          <div className="mb-14">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6 flex items-center gap-3">
              <span>AI 應用</span>
              <span className="h-px flex-1 bg-white/[0.06]" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {aiServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
