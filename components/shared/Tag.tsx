export default function Tag({ label }: { label: string }) {
  return (
    <span className="text-[10px] tracking-[0.16em] uppercase font-semibold px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur-sm">
      {label}
    </span>
  )
}
