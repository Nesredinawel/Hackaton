export default function GreenBtn({ href, label, onClick, size = 'base' }: {
  href?: string
  label: string
  onClick?: () => void
  size?: 'sm' | 'base' | 'lg'
}) {
  const cls = `inline-flex items-center justify-center font-semibold rounded-xl text-white transition-all bg-[#1D7A4E] hover:bg-[#166040] active:bg-[#115232]
    ${size === 'lg' ? 'px-8 py-4 text-base' : size === 'sm' ? 'px-4 py-2.5 text-sm' : 'px-6 py-3.5 text-sm'}`
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>
  return <button onClick={onClick} className={cls}>{label}</button>
}
