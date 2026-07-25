export default function RangeBar({ low, high, price }: { low: number; high: number; price: number }) {
  const pct = Math.max(4, Math.min(96, ((price - low) / Math.max(1, high - low)) * 100))
  return (
    <div className="my-4">
      <div className="relative h-1.5 rounded-full bg-[var(--surface-3)]">
        <div className="absolute inset-0 rounded-full bg-[var(--green)]" />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-[3px] z-10 shadow-md bg-[var(--green)]"
          style={{ borderColor: 'var(--surface)', left: `calc(${pct}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs theme-text-muted">
        <span>{low} birr</span>
        <span className="font-semibold theme-text">{price} birr median</span>
        <span>{high} birr</span>
      </div>
    </div>
  )
}
