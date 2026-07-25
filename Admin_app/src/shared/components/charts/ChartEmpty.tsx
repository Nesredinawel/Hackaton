export default function ChartEmpty({ message = 'No data available.' }: { message?: string }) {
  return (
    <div className="flex h-[220px] w-full items-center justify-center rounded-lg border border-dashed bg-muted/20">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
