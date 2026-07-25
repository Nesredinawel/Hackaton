export default function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#E8E4DC] last:border-0">
      <span className="text-sm text-[#6B6560]">{label}</span>
      <span className="text-sm font-semibold text-[#1A1814]">{value}</span>
    </div>
  )
}
