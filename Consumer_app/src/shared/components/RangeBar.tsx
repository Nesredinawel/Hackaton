export default function RangeBar({ low, high, price }: { low: number; high: number; price: number }) {
  const pct = Math.max(4, Math.min(96, ((price - low) / Math.max(1, high - low)) * 100))
  return (
    <div className="my-4">
      <div className="relative h-1.5 rounded-full bg-[#E8E4DC]">
        <div className="absolute inset-0 rounded-full bg-[#C6E8D6]" />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-[3px] border-white z-10 shadow-md bg-[#1D7A4E]"
          style={{ left: `calc(${pct}% - 10px)` }} />
      </div>
      <div className="flex justify-between mt-2 text-xs text-[#9C9590]">
        <span>{low} birr</span>
        <span className="font-semibold text-[#1A1814]">{price} birr median</span>
        <span>{high} birr</span>
      </div>
    </div>
  )
}
