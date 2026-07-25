export default function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b theme-border last:border-0">
      <span className="text-sm theme-text-muted">{label}</span>
      <span className="text-sm font-semibold theme-text">{value}</span>
    </div>
  )
}
