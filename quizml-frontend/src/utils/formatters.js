export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2,'0')
  const s = (seconds % 60).toString().padStart(2,'0')
  return `${m}:${s}`
}

export const MATERI_COLORS = {
  'Limit':              { bg: 'bg-[#2196F3]',         text: 'text-white', border: 'border-black', hex: '#2196F3'  },
  'Turunan':            { bg: 'bg-secondary',          text: 'text-black', border: 'border-black', hex: '#d0bfee'  },
  'Aplikasi Turunan':   { bg: 'bg-[#4CAF50]',         text: 'text-white', border: 'border-black', hex: '#4CAF50'  },
  'Integral Tentu':     { bg: 'bg-primary',            text: 'text-black', border: 'border-black', hex: '#b4ffec'  },
  'Teknik Integrasi':   { bg: 'bg-tertiary-container', text: 'text-black', border: 'border-black', hex: '#f6d06e'  },
  'Integral Lipat':     { bg: 'bg-error',              text: 'text-black', border: 'border-black', hex: '#ffb4ab'  },
}

export const KESULITAN_COLORS = {
  'Mudah':  { bg: 'bg-primary',           text: 'text-black', hex: '#b4ffec' },
  'Sedang': { bg: 'bg-tertiary-container', text: 'text-black', hex: '#f6d06e' },
  'Sulit':  { bg: 'bg-error',             text: 'text-black', hex: '#ffb4ab' },
}

export const MATERI_BAR_COLOR = {
  'Limit':            '#b4ffec',
  'Turunan':          '#d0bfee',
  'Aplikasi Turunan': '#4CAF50',
  'Integral Tentu':   '#b4ffec',
  'Teknik Integrasi': '#f6d06e',
  'Integral Lipat':   '#ffb4ab',
}

export const KATEGORI_CONFIG = {
  Beginner:     { color: 'text-tertiary-container', icon: '📚', desc: 'Terus semangat belajar Kalkulus!', accent: 'bg-tertiary-container' },
  Intermediate: { color: 'text-secondary',          icon: '⚡', desc: 'Kamu sudah di jalur yang benar!',  accent: 'bg-secondary' },
  Advanced:     { color: 'text-primary',             icon: '🏆', desc: 'Luar biasa! Pertahankan!',         accent: 'bg-primary' },
}

export const TIPE_ICONS = {
  Video:   '▶',
  Artikel: '📄',
  Latihan: '✏️',
  Buku:    '📚',
}
