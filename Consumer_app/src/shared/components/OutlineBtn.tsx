export default function OutlineBtn({ label, onClick, active }: { label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all
      ${active ? 'bg-[#1D7A4E] text-white border-[#1D7A4E]' : 'bg-white text-[#6B6560] border-[#E8E4DC] hover:border-[#9C9590]'}`}>
      {label}
    </button>
  )
}
