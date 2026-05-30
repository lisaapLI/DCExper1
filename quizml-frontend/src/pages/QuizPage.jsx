import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../hooks/useQuiz'
import { formatTime, MATERI_COLORS, KESULITAN_COLORS } from '../utils/formatters'

const CHOICES = ['A','B','C','D']
const CHOICE_KEYS = { a:'A', b:'B', c:'C', d:'D' }

const CHOICE_ACTIVE_BG   = ['bg-primary-container','bg-secondary','bg-tertiary-container','bg-primary']
const CHOICE_ACTIVE_TEXT = ['text-on-primary-container','text-on-secondary','text-on-tertiary-container','text-black']

const LEVEL_ACCENT = {
  'Mudah':  { bg: 'bg-primary',           label: '🌱 MUDAH' },
  'Sedang': { bg: 'bg-secondary',          label: '⚡ SEDANG' },
  'Sulit':  { bg: 'bg-tertiary-container', label: '🔥 SULIT' },
}

export default function QuizPage() {
  const navigate = useNavigate()
  const user = JSON.parse(sessionStorage.getItem('quizml_user') || 'null')
  useEffect(() => { if (!user) navigate('/') }, [])

  const {
    questions, currentQ, currentIndex, level,
    answers, answeredCount, progress,
    loading, submitting, error,
    elapsedSeconds,
    selectAnswer, nextQuestion, prevQuestion, jumpToQuestion, handleSubmit,
  } = useQuiz()

  // Keyboard A-D + arrow navigation
  useEffect(() => {
    const handler = (e) => {
      const k = e.key.toLowerCase()
      if (CHOICE_KEYS[k] && currentQ) selectAnswer(currentQ.id, CHOICE_KEYS[k])
      if (e.key === 'ArrowRight') nextQuestion()
      if (e.key === 'ArrowLeft')  prevQuestion()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentQ, selectAnswer, nextQuestion, prevQuestion])

  const lvAccent = LEVEL_ACCENT[level] || LEVEL_ACCENT['Mudah']

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex gap-2 justify-center">
          {[0,1,2].map(i => (
            <div key={i} className="w-4 h-4 bg-primary border-2 border-black animate-bounce-dot"
              style={{ animationDelay: `${i * 0.16}s` }} />
          ))}
        </div>
        <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">
          Memuat soal {level}...
        </p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface-container border-[3px] border-black neo-shadow p-8 max-w-sm text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="font-label-mono text-label-mono text-error mb-4 uppercase">{error}</p>
        <button onClick={() => navigate('/dashboard')}
          className="neo-btn bg-surface-variant text-on-surface border-[3px] border-black neo-shadow
            px-md py-xs font-label-mono font-black uppercase" style={{ borderRadius: 0 }}>
          ← DASHBOARD
        </button>
      </div>
    </div>
  )

  if (!currentQ) return null

  const materi    = currentQ.materi
  const kesulitan = currentQ.tingkat_kesulitan
  const mc        = MATERI_COLORS[materi]       || MATERI_COLORS['Limit']
  const kc        = KESULITAN_COLORS[kesulitan] || KESULITAN_COLORS['Sedang']

  const choiceMap = {
    A: currentQ.pilihan_a,
    B: currentQ.pilihan_b,
    C: currentQ.pilihan_c,
    D: currentQ.pilihan_d,
  }

  const selected = answers[currentQ.id]
  const isLast   = currentIndex === questions.length - 1
  const pct      = Math.round(((currentIndex + 1) / questions.length) * 100)

  return (
    <div className="min-h-screen bg-background text-on-surface">

      {/* ── TopBar ── */}
      <header className="border-b-[4px] border-black bg-surface-container sticky top-0 z-50
        py-4 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary border-[3px] border-black p-1 neo-shadow-sm">
              <span className="material-symbols-outlined text-black">quiz</span>
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-on-surface uppercase">
              Eureka Quiz
            </span>
            <div className={`${lvAccent.bg} text-black border-[2px] border-black px-2 py-0.5
              font-label-sm text-label-sm font-black neo-shadow-sm hidden sm:block`}>
              {lvAccent.label}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-label-mono text-label-sm text-on-surface-variant hidden sm:block">
              {user?.nama}
            </span>
            <div className="bg-surface-container-lowest border-[3px] border-black px-3 py-1
              flex items-center gap-2 neo-shadow-sm">
              <span className="material-symbols-outlined text-primary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
              <span className="font-label-mono font-bold text-on-surface">{formatTime(elapsedSeconds)}</span>
            </div>
            <div className="bg-surface-container-lowest border-[3px] border-black px-3 py-1 neo-shadow-sm">
              <span className="font-label-mono font-bold text-on-surface">{answeredCount}/{questions.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-8 pb-32">

        {/* ── Progress ── */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 flex-wrap">
                <span className={`${mc.bg} ${mc.text} font-label-mono text-[10px] px-3 py-1
                  border-[2px] border-black neo-shadow-sm uppercase font-black`}>{materi}</span>
                <span className={`${kc.bg} ${kc.text} font-label-mono text-[10px] px-3 py-1
                  border-[2px] border-black neo-shadow-sm uppercase font-black`}>{kesulitan}</span>
                <span className="bg-surface-container-highest text-on-surface-variant font-label-mono
                  text-[10px] px-3 py-1 border-[2px] border-black neo-shadow-sm uppercase font-black">
                  {currentQ.bab}
                </span>
              </div>
              <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Soal {currentIndex + 1}
              </h1>
            </div>
            <span className="font-label-mono text-label-sm text-on-surface-variant uppercase font-bold">
              {currentIndex + 1} dari {questions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-8 bg-surface-container-lowest border-[4px] border-black neo-shadow overflow-hidden">
            <div className="h-full bg-primary border-r-[4px] border-black transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
        </section>

        {/* ── Grid Soal + Pilihan ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

          {/* Soal */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container border-[4px] border-black p-8 neo-shadow-lg min-h-[200px]">
              <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                {currentQ.soal}
              </p>
            </div>
          </div>

          {/* Pilihan A-D */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="font-display text-headline-md text-on-surface mb-2">Select Answer</h2>
            {CHOICES.map((choice, idx) => {
              const isSelected = selected === choice
              return (
                <button
                  key={choice}
                  onClick={() => selectAnswer(currentQ.id, choice)}
                  className={`group flex items-center text-left border-[4px] border-black p-4
                    transition-all duration-100 cursor-pointer
                    ${isSelected
                      ? `${CHOICE_ACTIVE_BG[idx]} ${CHOICE_ACTIVE_TEXT[idx]}`
                      : 'bg-surface-container text-on-surface hover:-translate-x-0.5 hover:-translate-y-0.5'
                    }`}
                  style={{ borderRadius: 0, boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                >
                  <span className={`w-10 h-10 flex-shrink-0 flex items-center justify-center
                    font-label-mono font-black text-xl mr-4 border-2 border-black
                    ${isSelected ? 'bg-black text-white' : 'bg-surface-container-highest text-on-surface'}`}>
                    {choice}
                  </span>
                  <span className="font-label-mono text-label-mono font-bold">{choiceMap[choice]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Navigasi ── */}
        <div className="mt-16 flex flex-col items-center gap-8">
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">

            <button onClick={prevQuestion} disabled={currentIndex === 0}
              className="neo-btn w-full md:w-auto order-2 md:order-1 bg-surface-variant text-on-surface
                border-[4px] border-black px-12 py-4 font-display font-black uppercase text-xl neo-shadow
                disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ borderRadius: 0 }}>
              Sebelumnya
            </button>

            {/* Dot navigator */}
            <div className="order-3 md:order-2 flex flex-wrap justify-center gap-2 max-w-xs">
              {questions.map((q, i) => (
                <button key={q.id} onClick={() => jumpToQuestion(i)}
                  className={`w-8 h-8 flex items-center justify-center border-[2px] border-black
                    font-label-mono text-xs neo-shadow-sm transition-colors
                    ${i === currentIndex
                      ? 'bg-primary text-black font-black'
                      : answers[q.id]
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container-high text-on-surface hover:bg-primary hover:text-black'
                    }`}
                  style={{ borderRadius: 0 }}>
                  {i + 1}
                </button>
              ))}
            </div>

            {isLast ? (
              <button onClick={handleSubmit} disabled={submitting}
                className="neo-btn w-full md:w-auto order-1 md:order-3 bg-tertiary-container
                  text-on-tertiary-container border-[4px] border-black px-12 py-4
                  font-display font-black uppercase text-xl neo-shadow"
                style={{ borderRadius: 0 }}>
                {submitting ? (
                  <span className="flex items-center gap-3">
                    <span className="inline-flex gap-1">
                      {[0,1,2].map(i => (
                        <span key={i} className="w-2 h-2 bg-black rounded-full animate-bounce-dot"
                          style={{ animationDelay: `${i * 0.16}s` }} />
                      ))}
                    </span>
                    MENGANALISIS...
                  </span>
                ) : 'SUBMIT QUIZ ✓'}
              </button>
            ) : (
              <button onClick={nextQuestion}
                className="neo-btn w-full md:w-auto order-1 md:order-3 bg-tertiary-container
                  text-on-tertiary-container border-[4px] border-black px-12 py-4
                  font-display font-black uppercase text-xl neo-shadow"
                style={{ borderRadius: 0 }}>
                Lanjut →
              </button>
            )}
          </div>

          {/* Keyboard hints */}
          <div className="flex flex-col items-center gap-2 opacity-70">
            <div className="flex items-center gap-2 font-label-mono text-label-sm text-on-surface-variant">
              <span>Tekan</span>
              {['A','B','C','D'].map(k => (
                <span key={k} className="bg-surface-container-highest border border-black px-1.5 neo-shadow-sm font-black">
                  {k}
                </span>
              ))}
              <span>untuk menjawab</span>
            </div>
            <div className="flex items-center gap-2 font-label-mono text-label-sm text-on-surface-variant">
              {['←','→'].map(k => (
                <span key={k} className="bg-surface-container-highest border border-black px-1.5 neo-shadow-sm">{k}</span>
              ))}
              <span>navigasi</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
