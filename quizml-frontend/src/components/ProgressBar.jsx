export default function ProgressBar({ value, max = 100, hexColor = '#b4ffec', label }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between font-label-mono text-label-mono mb-xs">
          <span className="text-on-surface">{label}</span>
          <span style={{ color: hexColor }}>{pct}%</span>
        </div>
      )}
      <div className="h-4 bg-surface neo-border-2 overflow-hidden">
        <div className="h-full transition-all duration-700 ease-out border-r-2 border-black"
          style={{ width: `${pct}%`, background: hexColor }} />
      </div>
    </div>
  )
}
