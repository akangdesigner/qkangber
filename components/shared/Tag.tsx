export default function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent-light)] text-[var(--color-accent)]">
      {label}
    </span>
  )
}
