export default function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map(i => (
        <div key={i} className={`h-2 w-8 rounded-full transition-colors ${i < current ? 'bg-[#FFA42B]' : 'bg-[#282828]'}`} />
      ))}
    </div>
  )
}
