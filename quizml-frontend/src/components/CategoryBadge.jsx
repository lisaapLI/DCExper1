import { KATEGORI_CONFIG } from '../utils/formatters'

export default function CategoryBadge({ kategori, size = 'md' }) {
  const cfg = KATEGORI_CONFIG[kategori] || KATEGORI_CONFIG['Beginner']
  const sizeCls = size === 'lg' ? 'text-headline-md px-md py-xs gap-3' : 'text-label-mono px-xs py-1 gap-2'
  return (
    <span className={`inline-flex items-center font-label-mono font-black border-2 border-black neo-shadow-sm
      ${cfg.accent} text-black uppercase tracking-wider ${sizeCls}`}>
      <span>{cfg.icon}</span>
      <span>{kategori}</span>
    </span>
  )
}
