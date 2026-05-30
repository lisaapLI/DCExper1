import { useEffect, useState } from 'react'
import { useNavigate }   from 'react-router-dom'
import CategoryBadge     from '../components/CategoryBadge'
import ProgressBar       from '../components/ProgressBar'
import MateriRadarChart  from '../components/RadarChart'
import { MATERI_COLORS, MATERI_BAR_COLOR, KESULITAN_COLORS, KATEGORI_CONFIG, TIPE_ICONS } from '../utils/formatters'

const LEVEL_ACCENT = {
  'Mudah':  { bg: 'bg-primary',           label: '🌱 MUDAH' },
  'Sedang': { bg: 'bg-secondary',          label: '⚡ SEDANG' },
  'Sulit':  { bg: 'bg-tertiary-container', label: '🔥 SULIT' },
}

const formatWaktu = (detik) => {
  if (!detik) return '-'
  const m = Math.floor(detik / 60)
  const s = detik % 60
  return `${m}m ${s}s`
}

// Simpan history ke localStorage — dipanggil sekali saat result tiba
function saveToHistory(r, s) {
  try {
    // Buat unique key per sesi quiz ini menggunakan session_id dari backend
    const savedFlag  = `quizml_saved_${r.session_id || r.result_id}`
    if (localStorage.getItem(savedFlag)) return  // sudah pernah disimpan

    localStorage.setItem(savedFlag, '1')  // tandai sudah disimpan

    const entry = {
      level:              r.level || 'Mudah',
      total_score:        r.total_score,
      jumlah_benar:       r.jumlah_benar,
      total_soal:         r.total_soal,
      kategori_kemampuan: r.kategori_kemampuan,
      materi_terlemah:    r.materi_terlemah,
      waktu:              formatWaktu(r.waktu_detik),
      timestamp:          new Date().toLocaleString('id-ID'),
    }

    const storageKey = `quizml_history_${s.nim}`
    const existing   = JSON.parse(localStorage.getItem(storageKey) || '[]')
    existing.push(entry)
    localStorage.setItem(storageKey, JSON.stringify(existing))
  } catch (e) {
    console.error('saveToHistory error:', e)
  }
}

export default function ResultPage() {
  const navigate = useNavigate()
  const [result,  setResult]  = useState(null)
  const [student, setStudent] = useState(null)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    try {
      const r = JSON.parse(sessionStorage.getItem('quizml_result') || 'null')
      const s = JSON.parse(sessionStorage.getItem('quizml_user')   || 'null')
      if (!r || !s) { navigate('/'); return }

      setResult(r)
      setStudent(s)
      saveToHistory(r, s)   // simpan ke localStorage dengan guard flag

    } catch (e) {
      console.error('ResultPage error:', e)
      navigate('/')
    } finally {
      setReady(true)
    }
  }, [])

  if (!ready) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex gap-2">
        {[0,1,2].map(i => (
          <div key={i} className="w-4 h-4 bg-primary border-2 border-black animate-bounce-dot"
            style={{ animationDelay: `${i * 0.16}s` }} />
        ))}
      </div>
    </div>
  )

  if (!result || !student) return null

  const {
    nama, nim, total_score, jumlah_benar, jumlah_salah, total_soal, level,
    materi_scores, kesulitan_scores,
    materi_terlemah, kategori_kemampuan,
    rekomendasi, ringkasan,
  } = result

  const kategoriCfg = KATEGORI_CONFIG[kategori_kemampuan] || KATEGORI_CONFIG['Beginner']
  const rekList     = Object.entries(rekomendasi || {})
  const lvAccent    = LEVEL_ACCENT[level] || LEVEL_ACCENT['Mudah']

  const scoreLabel =
    total_score >= 80 ? 'Bagus Sekali!'  :
    total_score >= 60 ? 'Cukup Baik!'    : 'Perlu Belajar!'

  const heroAccent =
    total_score >= 80 ? 'bg-secondary'           :
    total_score >= 60 ? 'bg-primary-container'   : 'bg-tertiary-container'

  const handleRetry = () => {
    sessionStorage.removeItem('quizml_result')
    navigate('/quiz', { state: { level } })
  }

  const handleDashboard = () => {
    sessionStorage.removeItem('quizml_result')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">

      {/* TopNav */}
      <nav className="w-full sticky top-0 z-50 border-b-4 border-black bg-surface flex justify-between
        items-center px-margin-mobile md:px-margin-desktop py-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="font-display text-headline-md font-black text-primary tracking-tight uppercase">
          Eureka Quiz
        </div>
        <div className="flex items-center gap-3">
          <div className={`${lvAccent.bg} text-black border-[2px] border-black px-3 py-1
            font-label-sm text-label-sm font-black neo-shadow-sm`}>
            {lvAccent.label}
          </div>
          <button onClick={handleDashboard}
            className="neo-btn bg-surface-variant text-on-surface border-[3px] border-black px-4 py-1.5
              font-label-mono text-label-sm font-black uppercase neo-shadow-sm"
            style={{ borderRadius: 0 }}>
            ← Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-xl space-y-xl">

        {/* Score Hero */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-lg items-stretch animate-fade-up">
          <div className={`md:col-span-8 ${heroAccent} border-[3px] border-black neo-shadow-xl p-xl
            relative overflow-hidden flex flex-col justify-center min-h-[280px]`}>
            <div className="relative z-10 space-y-md">
              <div>
                <h2 className="font-display text-display text-black leading-none">{total_score}/100</h2>
                <p className="font-display text-headline-md text-black mt-xs">{scoreLabel}</p>
              </div>
              <div>
                <p className="font-label-mono text-label-mono text-black/60 bg-black/10 inline-block px-xs py-base border-2 border-black">
                  NIM: {student.nim}
                </p>
                <h3 className="font-display text-headline-lg text-black mt-xs">{student.nama}</h3>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-[140px] opacity-20 select-none">🤖</div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-md">
            {[
              { label:'Benar',      value: jumlah_benar, bg:'bg-primary',            icon:'check_circle' },
              { label:'Salah',      value: jumlah_salah, bg:'bg-error',              icon:'cancel' },
              { label:'Total Soal', value: total_soal,   bg:'bg-tertiary-container', icon:'quiz' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border-[3px] border-black neo-shadow p-md flex items-center justify-between`}>
                <div>
                  <p className="font-label-mono text-label-mono text-black/70">{s.label}</p>
                  <h4 className="font-display text-headline-lg text-black">{s.value}</h4>
                </div>
                <span className="material-symbols-outlined text-headline-lg text-black"
                  style={{ fontVariationSettings:"'FILL' 1" }}>{s.icon}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Analisis Kesulitan & Kategori */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl animate-fade-up animate-delay-100">
          {kesulitan_scores && Object.keys(kesulitan_scores).length > 0 && (
            <div className="bg-surface-container border-[3px] border-black p-lg space-y-lg neo-shadow">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">bar_chart</span>
                <h3 className="font-display text-headline-md text-on-surface">Analisis Kesulitan</h3>
              </div>
              <div className="grid grid-cols-3 gap-md">
                {Object.entries(kesulitan_scores).map(([k, v]) => {
                  const kc = KESULITAN_COLORS[k] || KESULITAN_COLORS['Sedang']
                  return (
                    <div key={k} className={`${kc.bg} border-[2px] border-black p-md text-center neo-shadow-sm`}>
                      <p className={`font-label-mono text-label-mono ${kc.text} font-black uppercase`}>{k}</p>
                      <h5 className="font-display text-headline-md text-black">{Math.round(v)}%</h5>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="bg-surface-container border-[3px] border-black p-lg space-y-lg neo-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-secondary">psychology</span>
                <h3 className="font-display text-headline-md text-on-surface">Kategori Kemampuan</h3>
              </div>
              <span className="font-label-mono text-label-sm bg-black text-on-surface px-xs py-1 border-2 border-black">
                K-Means AI
              </span>
            </div>
            <div className={`flex items-center gap-lg ${kategoriCfg.accent} border-[3px] border-black p-md neo-shadow-sm`}>
              <div className="text-5xl">{kategoriCfg.icon}</div>
              <div>
                <h4 className="font-display text-headline-md text-black">{kategori_kemampuan} Learner</h4>
                <p className="font-body-md text-body-md text-black/70">{ringkasan}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Penguasaan Materi */}
        {materi_scores && Object.keys(materi_scores).length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-xl animate-fade-up animate-delay-200">
            <div className="lg:col-span-7 bg-surface-container border-[3px] border-black p-lg space-y-lg neo-shadow">
              <h3 className="font-display text-headline-md text-on-surface">Penguasaan Materi</h3>
              <div className="space-y-lg">
                {Object.entries(materi_scores).map(([materi, skor]) => (
                  <div key={materi} className="space-y-xs">
                    <ProgressBar value={skor} max={100} hexColor={MATERI_BAR_COLOR[materi] || '#b4ffec'} label={materi} />
                    {materi === materi_terlemah && (
                      <p className="text-error font-label-mono text-[10px] uppercase font-black">⚠ BUTUH PERHATIAN EKSTRA</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 bg-surface-container border-[3px] border-black p-lg flex flex-col neo-shadow">
              <h3 className="font-display text-headline-md text-on-surface mb-xl">Visual Kompetensi</h3>
              <div className="flex-1 flex items-center justify-center">
                <MateriRadarChart scores={materi_scores} />
              </div>
            </div>
          </section>
        )}

        {/* Rekomendasi */}
        {rekList.length > 0 && (
          <section className="space-y-lg animate-fade-up animate-delay-300">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-tertiary-container">rocket_launch</span>
              <h3 className="font-display text-headline-md text-on-surface">Rekomendasi Belajar</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {rekList.flatMap(([materi, rec]) =>
                (rec.sumber || []).map((s, i) => (
                  <div key={`${materi}-${i}`}
                    className="neo-btn bg-surface-container border-[3px] border-black p-md flex flex-col h-full neo-shadow">
                    <div className="mb-md h-2 w-full" style={{ background: MATERI_BAR_COLOR[materi] || '#b4ffec' }} />
                    <span className="font-label-mono text-label-sm mb-xs" style={{ color: MATERI_BAR_COLOR[materi] }}>
                      {TIPE_ICONS[s.tipe]} {s.tipe?.toUpperCase()}
                    </span>
                    <h5 className="font-display text-headline-md text-on-surface mb-xs leading-tight">{s.judul}</h5>
                    <p className="font-body-md text-on-surface-variant flex-grow mb-md text-sm">{s.deskripsi}</p>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                        className="font-label-mono text-label-mono text-black px-md py-xs border-[2px] border-black
                          text-center uppercase font-black block"
                        style={{ borderRadius: 0, background: MATERI_BAR_COLOR[materi] || '#b4ffec' }}>
                        Buka Sumber →
                      </a>
                    ) : (
                      <span className="font-label-mono text-label-mono bg-surface-container-high
                        text-on-surface-variant px-md py-xs border-[2px] border-black text-center uppercase block">
                        Buku Referensi
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="flex flex-col md:flex-row gap-lg pt-xl animate-fade-up">
          <button onClick={handleRetry}
            className="neo-btn flex-1 bg-secondary text-black border-[4px] border-black py-lg px-xl neo-shadow-lg
              flex items-center justify-center gap-md uppercase font-black"
            style={{ borderRadius: 0 }}>
            <span className="material-symbols-outlined text-headline-md">replay</span>
            <span className="font-display text-headline-md">Ulangi Level {level}</span>
          </button>
          <button onClick={handleDashboard}
            className="neo-btn flex-1 bg-tertiary-fixed text-black border-[4px] border-black py-lg px-xl neo-shadow-lg
              flex items-center justify-center gap-md uppercase font-black"
            style={{ borderRadius: 0 }}>
            <span className="material-symbols-outlined text-headline-md">dashboard</span>
            <span className="font-display text-headline-md">Pilih Level Lain</span>
          </button>
        </section>
      </main>

      <footer className="w-full py-4 border-t-4 border-black bg-surface-container mt-xl">
        <p className="text-center font-label-sm text-label-sm text-on-surface-variant opacity-60">
          © 2024 EUREKA QUIZ — CAPSTONE PROJECT MACHINE LEARNING
        </p>
      </footer>
    </div>
  )
}
