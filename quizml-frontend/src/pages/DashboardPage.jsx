import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LEVELS = [
  { key:'Mudah',  label:'MUDAH',  icon:'🌱', desc:'Konsep dasar limit, turunan, dan integral',              soal:'20 Soal', accent:'bg-primary',           textColor:'text-black' },
  { key:'Sedang', label:'SEDANG', icon:'⚡', desc:'Teknik lanjut, aturan rantai, dan integral tentu',        soal:'20 Soal', accent:'bg-secondary',          textColor:'text-black' },
  { key:'Sulit',  label:'SULIT',  icon:'🔥', desc:'Teknik integrasi lanjut dan integral lipat',              soal:'20 Soal', accent:'bg-tertiary-container',  textColor:'text-black' },
]

const getKategoriColor = (k) =>
  k === 'Advanced' ? 'text-primary' : k === 'Intermediate' ? 'text-secondary' : 'text-tertiary-container'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user,    setUser]    = useState(null)
  const [history, setHistory] = useState([])
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('quizml_user')
      if (!raw) { navigate('/'); return }
      const u = JSON.parse(raw)
      if (!u?.nim) { navigate('/'); return }
      setUser(u)

      // Baca history dari localStorage (persisten, tidak hilang saat logout)
      const storageKey = `quizml_history_${u.nim}`
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
      // Tampilkan terbaru di atas
      setHistory([...saved].reverse())
    } catch {
      navigate('/')
    } finally {
      setReady(true)
    }
  }, [])

  if (!ready || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex gap-2">
        {[0,1,2].map(i => (
          <div key={i} className="w-4 h-4 bg-primary border-2 border-black animate-bounce-dot"
            style={{ animationDelay: `${i * 0.16}s` }} />
        ))}
      </div>
    </div>
  )

  const startQuiz = (level) => navigate('/quiz', { state: { level } })

  const handleLogout = () => {
    // Hanya hapus session, BUKAN localStorage agar history tetap ada
    sessionStorage.removeItem('quizml_user')
    sessionStorage.removeItem('quizml_result')
    sessionStorage.removeItem('quizml_nim')
    navigate('/')
  }

  // Best score & jumlah percobaan per level
  const bestScores = history.reduce((acc, r) => {
    if (acc[r.level] === undefined || r.total_score > acc[r.level]) acc[r.level] = r.total_score
    return acc
  }, {})

  const attempts = (level) => history.filter(h => h.level === level).length

  return (
    <div className="min-h-screen bg-background text-on-surface">

      {/* TopBar */}
      <header className="border-b-[4px] border-black bg-surface-container sticky top-0 z-50 px-margin-mobile md:px-margin-desktop py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary border-[3px] border-black p-1 neo-shadow-sm">
              <span className="material-symbols-outlined text-black">quiz</span>
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-on-surface uppercase">
              Eureka Quiz
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-surface-container-high border-[3px] border-black px-4 py-1.5 neo-shadow-sm hidden sm:block">
              <span className="font-label-mono text-label-sm text-on-surface font-bold uppercase">{user.nama}</span>
            </div>
            <button onClick={handleLogout}
              className="neo-btn bg-error text-black border-[3px] border-black px-3 py-1.5 neo-shadow-sm
                font-label-mono text-label-sm font-black uppercase"
              style={{ borderRadius: 0 }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-xl space-y-xl">

        {/* Welcome */}
        <section className="animate-fade-up">
          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-1">Selamat datang,</p>
          <h1 className="font-display text-headline-lg text-on-surface uppercase tracking-tight">{user.nama}</h1>
          <p className="font-label-mono text-label-sm text-on-surface-variant mt-1">
            NIM: {user.nim} · Pilih level untuk memulai quiz
          </p>
        </section>

        {/* Level Cards */}
        <section className="animate-fade-up animate-delay-100">
          <div className="flex items-center gap-xs mb-lg">
            <span className="material-symbols-outlined text-primary">layers</span>
            <h2 className="font-display text-headline-md text-on-surface uppercase">Pilih Level</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {LEVELS.map(lv => {
              const best = bestScores[lv.key]
              const att  = attempts(lv.key)
              return (
                <div key={lv.key}
                  className={`${lv.accent} border-[4px] border-black flex flex-col cursor-pointer transition-all duration-100`}
                  style={{ boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                  onClick={() => startQuiz(lv.key)}
                  onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='6px 6px 0px 0px rgba(0,0,0,1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0px 0px rgba(0,0,0,1)' }}
                  onMouseDown={e  => { e.currentTarget.style.transform='translate(2px,2px)'; e.currentTarget.style.boxShadow='none' }}
                  onMouseUp={e    => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='6px 6px 0px 0px rgba(0,0,0,1)' }}>
                  <div className="p-lg flex flex-col gap-md flex-1">
                    <div className="flex items-start justify-between">
                      <span className="text-5xl">{lv.icon}</span>
                      <span className="font-label-mono text-label-sm bg-black text-white px-2 py-0.5 font-black">{lv.soal}</span>
                    </div>
                    <div>
                      <h3 className={`font-display text-headline-lg ${lv.textColor} uppercase tracking-tight leading-none`}>{lv.label}</h3>
                      <p className={`font-body-md text-body-md ${lv.textColor} opacity-70 mt-xs leading-snug`}>{lv.desc}</p>
                    </div>
                    <div className="border-t-[2px] border-black pt-xs flex items-center justify-between">
                      {best !== undefined ? (
                        <div>
                          <p className="font-label-mono text-[10px] text-black/60 uppercase font-black">Best Score</p>
                          <p className={`font-display text-headline-md ${lv.textColor} font-black`}>{best}/100</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-label-mono text-[10px] text-black/60 uppercase font-black">Belum dikerjakan</p>
                          <p className={`font-display text-headline-md ${lv.textColor} opacity-40`}>—</p>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="font-label-mono text-[10px] text-black/60 uppercase font-black">Percobaan</p>
                        <p className={`font-display text-headline-md ${lv.textColor} font-black`}>{att}x</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black text-white px-lg py-xs flex items-center justify-between font-label-mono text-label-mono font-black uppercase">
                    <span>Mulai Quiz</span><span>→</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* History */}
        <section className="animate-fade-up animate-delay-200">
          <div className="flex items-center justify-between mb-lg">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary">history</span>
              <h2 className="font-display text-headline-md text-on-surface uppercase">Riwayat Quiz</h2>
              <span className="font-label-mono text-label-sm text-on-surface-variant ml-2">({history.length} sesi)</span>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => {
                  const key = `quizml_history_${user.nim}`
                  localStorage.removeItem(key)
                  setHistory([])
                }}
                className="neo-btn bg-surface-container border-[2px] border-black px-3 py-1 neo-shadow-sm
                  font-label-mono text-label-sm text-on-surface-variant font-black uppercase hover:bg-error hover:text-black"
                style={{ borderRadius: 0 }}>
                Hapus Semua
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="bg-surface-container border-[3px] border-black p-xl neo-shadow text-center">
              <p className="text-4xl mb-md">📋</p>
              <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">Belum ada riwayat quiz.</p>
              <p className="font-label-mono text-label-sm text-on-surface-variant mt-xs">Pilih level di atas untuk memulai!</p>
            </div>
          ) : (
            <div className="space-y-md">
              {history.map((h, i) => {
                const lv         = LEVELS.find(l => l.key === h.level) || LEVELS[0]
                const scoreColor = h.total_score >= 80 ? 'text-primary' : h.total_score >= 60 ? 'text-secondary' : 'text-error'
                return (
                  <div key={i} className="bg-surface-container border-[3px] border-black neo-shadow flex items-center gap-md p-md">
                    {/* Level badge */}
                    <div className={`${lv.accent} border-[2px] border-black px-3 py-1 neo-shadow-sm flex-shrink-0`}>
                      <span className="font-label-mono text-label-sm font-black text-black uppercase">{h.level}</span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-label-mono text-label-mono text-on-surface font-bold">
                        {h.jumlah_benar}/{h.total_soal} benar
                        <span className="text-on-surface-variant font-normal ml-2">· {h.waktu}</span>
                        <span className={`ml-2 ${getKategoriColor(h.kategori_kemampuan)}`}> · {h.kategori_kemampuan}</span>
                      </p>
                      {h.materi_terlemah && (
                        <p className="font-label-mono text-label-sm text-on-surface-variant">
                          Materi terlemah: {h.materi_terlemah}
                        </p>
                      )}
                      <p className="font-label-sm text-label-sm text-on-surface-variant opacity-50">{h.timestamp}</p>
                    </div>
                    {/* Score */}
                    <div className="text-right flex-shrink-0">
                      <p className={`font-display text-headline-lg font-black ${scoreColor}`}>{h.total_score}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">/100</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
