const items = [
  { kw: 'n8n', label: '工作流自動化', desc: 'Webhook · Cron · Self-hosted' },
  { kw: 'RAG', label: '檢索增強生成', desc: 'Pinecone · pgvector · Qdrant' },
  { kw: 'Agent', label: 'AI Agent 架構', desc: 'Tool use · Memory · Planning' },
  { kw: 'Prompt', label: '提示詞工程', desc: 'Claude · GPT · Gemini' },
]

export default function CapabilityStrip() {
  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 border-y border-white/[0.05]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04]">
        {items.map((it) => (
          <div key={it.kw} className="bg-[#05060a] p-5 sm:p-7 hover:bg-white/[0.02] transition-colors duration-200">
            <p
              className="text-[2rem] font-semibold tracking-[-0.02em] mb-1"
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {it.kw}
            </p>
            <p className="text-sm font-medium text-slate-200 mb-1">{it.label}</p>
            <p className="text-[11px] text-slate-500 tracking-wide">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
