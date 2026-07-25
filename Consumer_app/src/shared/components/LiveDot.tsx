export default function LiveDot({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const d = size === 'md' ? 'w-2.5 h-2.5' : 'w-2 h-2'
  return (
    <span className={`relative flex items-center justify-center flex-shrink-0 ${d}`}>
      <span className="ping-sm absolute inline-flex h-full w-full rounded-full bg-[#1ED760] opacity-40" />
      <span className={`relative rounded-full bg-[#1ED760] ${d}`} />
    </span>
  )
}
