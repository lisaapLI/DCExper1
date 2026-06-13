import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../hooks/useQuiz'
import { formatTime } from '../utils/formatters'

const CHOICES = ['A','B','C','D']
const CHOICE_KEYS = { a:'A', b:'B', c:'C', d:'D' }

const LEVEL_ACCENT = {
  'Mudah':  { bg: '#22C55E', color: '#fff' },
  'Sedang': { bg: '#F59E0B', color: '#fff' },
  'Sulit':  { bg: '#F97316', color: '#fff' },
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
    <div style={{ minHeight:'100vh', background:'#FAFAF9', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:14, color:'#78716C', fontFamily:'Inter,sans-serif' }}>Memuat soal {level}...</div>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight:'100vh', background:'#FAFAF9', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'#fff', border:'1.5px solid #E7E5E4', borderRadius:16, padding:40, maxWidth:380, textAlign:'center', fontFamily:'Inter,sans-serif' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>&#9888;</div>
        <p style={{ color:'#DC2626', fontSize:14, marginBottom:20 }}>{error}</p>
        <button onClick={() => navigate('/dashboard')} style={s.btnGhost}>&#8592; Dashboard</button>
      </div>
    </div>
  )

  if (!currentQ) return null

  const selected = answers[currentQ.id]
  const isLast   = currentIndex === questions.length - 1
  const answeredList = questions.map(q => !!answers[q.id])
  const unansweredCount = questions.length - answeredCount

  const choiceMap = { A: currentQ.pilihan_a, B: currentQ.pilihan_b, C: currentQ.pilihan_c, D: currentQ.pilihan_d }

  return (
    <div style={s.root}>
      {/* TopBar */}
      <header style={s.topbar}>
        <div style={s.topbarInner}>
          <div style={s.topbarLeft}>
            <span style={s.logoText}>&#127891; Eureka Quiz</span>
            <span style={{ ...s.badge, background: lvAccent.bg, color: lvAccent.color }}>
              {level}
            </span>
          </div>
          <div style={s.topbarRight}>
            <span style={s.userName}>{user?.nama}</span>
            <div style={s.timerBox}>&#9201; {formatTime(elapsedSeconds)}</div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div style={s.body}>

        {/* Konten Soal */}
        <div style={s.content}>

          {/* Info soal */}
          <div style={s.soalMeta}>
            <div style={s.metaLeft}>
              {currentQ.materi && <span style={s.materiBadge}>{currentQ.materi}</span>}
              {currentQ.tingkat_kesulitan && <span style={s.kesulitanBadge}>{currentQ.tingkat_kesulitan}</span>}
            </div>
            <span style={s.soalNum}>Soal {currentIndex + 1} / {questions.length}</span>
          </div>

          {/* Progress bar */}
          <div style={s.progressBg}>
            <div style={{ ...s.progressFill, width: `${(answeredCount / questions.length) * 100}%` }} />
          </div>

          {/* Teks soal */}
          <div style={s.soalCard}>
            <p style={s.soalText}>{currentQ.soal}</p>
          </div>

          {/* Pilihan jawaban */}
          <div style={s.pilihanList}>
            {CHOICES.map((choice) => {
              const isSelected = selected === choice
              return (
                <button
                  key={choice}
                  onClick={() => selectAnswer(currentQ.id, choice)}
                  style={{
                    ...s.choiceBtn,
                    background: isSelected ? '#FFF7ED' : '#FFFFFF',
                    borderColor: isSelected ? '#F97316' : '#E7E5E4',
                    borderWidth: isSelected ? 2 : 1.5,
                  }}
                >
                  <span style={{
                    ...s.choiceKey,
                    background: isSelected ? '#F97316' : '#F5F5F4',
                    color: isSelected ? '#FFFFFF' : '#78716C',
                  }}>
                    {choice}
                  </span>
                  <span style={{ ...s.choiceText, fontWeight: isSelected ? 600 : 400, color: isSelected ? '#EA580C' : '#1C1917' }}>
                    {choiceMap[choice]}
                  </span>
                  {isSelected && <span style={s.checkmark}>&#10003;</span>}
                </button>
              )
            })}
          </div>

          {/* Navigasi bawah */}
          <div style={s.navRow}>
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              style={{ ...s.btnGhost, opacity: currentIndex === 0 ? 0.35 : 1 }}
            >
              &#8592; Sebelumnya
            </button>

            <span style={s.hintText}>
              Tekan <b>A B C D</b> atau <b>&#8592; &#8594;</b>
            </span>

            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ ...s.btnOrange, opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Menganalisis...' : 'Submit Quiz \u2713'}
              </button>
            ) : (
              <button onClick={nextQuestion} style={s.btnOrange}>
                Lanjut &#8594;
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Nomor Soal */}
        <aside style={s.sidebar}>
          <div style={s.sidebarHeader}>
            <span style={s.sidebarTitle}>Nomor Soal</span>
            <span style={s.sidebarCount}>{answeredCount}/{questions.length}</span>
          </div>

          {/* Legend */}
          <div style={s.legend}>
            <div style={s.legendItem}>
              <span style={{ ...s.legendDot, background:'#F97316' }} /> Aktif
            </div>
            <div style={s.legendItem}>
              <span style={{ ...s.legendDot, background:'#FED7AA' }} /> Dijawab
            </div>
            <div style={s.legendItem}>
              <span style={{ ...s.legendDot, background:'#F5F5F4' }} /> Belum
            </div>
          </div>

          {/* Grid nomor */}
          <div style={s.dotGrid}>
            {questions.map((q, i) => {
              const isActive   = i === currentIndex
              const isAnswered = !!answers[q.id]
              return (
                <button
                  key={q.id}
                  onClick={() => jumpToQuestion(i)}
                  title={`Soal ${i + 1}${isAnswered ? ' (sudah dijawab)' : ''}`}
                  style={{
                    ...s.dotBtn,
                    background: isActive ? '#F97316' : isAnswered ? '#FED7AA' : '#F5F5F4',
                    color: isActive ? '#FFFFFF' : isAnswered ? '#EA580C' : '#78716C',
                    border: isActive ? '2px solid #EA580C' : isAnswered ? '2px solid #FED7AA' : '2px solid #E7E5E4',
                    fontWeight: isActive ? 700 : isAnswered ? 600 : 400,
                    boxShadow: isActive ? '0 2px 8px #F9731644' : 'none',
                  }}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          {/* Ringkasan */}
          <div style={s.sidebarSummary}>
            <div style={s.summaryRow}>
              <span style={s.summaryLabel}>Dijawab</span>
              <span style={{ ...s.summaryVal, color:'#16A34A' }}>{answeredCount}</span>
            </div>
            <div style={s.summaryRow}>
              <span style={s.summaryLabel}>Belum</span>
              <span style={{ ...s.summaryVal, color:'#DC2626' }}>{unansweredCount}</span>
            </div>
          </div>

          {/* Tombol submit di sidebar */}
          {isLast && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ ...s.btnOrangeFull, marginTop:16, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Menganalisis...' : 'Submit Quiz \u2713'}
            </button>
          )}

          {unansweredCount === 0 && !isLast && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ ...s.btnOrangeFull, marginTop:16, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Menganalisis...' : 'Selesai & Submit'}
            </button>
          )}
        </aside>
      </div>
    </div>
  )
}

const O = '#F97316'
const OD = '#EA580C'

const s = {
  root: { minHeight:'100vh', background:'#FAFAF9', fontFamily:"'Inter',sans-serif", color:'#1C1917' },

  topbar: {
    background:'#FFFFFF', borderBottom:'1.5px solid #E7E5E4',
    padding:'10px 24px', position:'sticky', top:0, zIndex:50,
    boxShadow:'0 1px 4px rgba(0,0,0,0.05)',
  },
  topbarInner: { maxWidth:1280, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' },
  topbarLeft: { display:'flex', alignItems:'center', gap:12 },
  logoText: { fontSize:18, fontWeight:800, letterSpacing:'-0.4px' },
  badge: { padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 },
  topbarRight: { display:'flex', alignItems:'center', gap:12 },
  userName: { fontSize:13, color:'#78716C' },
  timerBox: {
    background:'#FFF7ED', border:'1.5px solid #FED7AA', borderRadius:8,
    padding:'5px 12px', fontSize:13, fontWeight:700, color:'#EA580C',
  },

  body: {
    maxWidth:1280, margin:'0 auto', padding:'24px 24px 60px',
    display:'grid', gridTemplateColumns:'1fr 220px', gap:24, alignItems:'start',
  },

  content: { display:'flex', flexDirection:'column', gap:16 },

  soalMeta: { display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 },
  metaLeft: { display:'flex', gap:8, flexWrap:'wrap' },
  materiBadge: {
    background:'#FFF7ED', border:'1.5px solid #FED7AA', borderRadius:20,
    padding:'3px 10px', fontSize:11, fontWeight:700, color:'#EA580C',
  },
  kesulitanBadge: {
    background:'#F0FDF4', border:'1.5px solid #BBF7D0', borderRadius:20,
    padding:'3px 10px', fontSize:11, fontWeight:700, color:'#16A34A',
  },
  soalNum: { fontSize:13, color:'#78716C', fontWeight:600 },

  progressBg: { height:6, background:'#E7E5E4', borderRadius:99, overflow:'hidden' },
  progressFill: { height:'100%', background:`linear-gradient(90deg, ${O}, ${OD})`, borderRadius:99, transition:'width 0.4s' },

  soalCard: {
    background:'#FFFFFF', border:'1.5px solid #E7E5E4', borderRadius:14,
    padding:'24px 28px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
  },
  soalText: { fontSize:15, lineHeight:1.75, margin:0 },

  pilihanList: { display:'flex', flexDirection:'column', gap:10 },
  choiceBtn: {
    display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
    borderStyle:'solid', borderRadius:12, cursor:'pointer',
    textAlign:'left', transition:'all 0.15s', fontFamily:'inherit',
    boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
  },
  choiceKey: {
    width:32, height:32, borderRadius:8, flexShrink:0,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:13, fontWeight:700, transition:'all 0.15s',
  },
  choiceText: { fontSize:14, lineHeight:1.4, flex:1 },
  checkmark: { fontSize:14, color:'#F97316', fontWeight:700, marginLeft:'auto', flexShrink:0 },

  navRow: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    paddingTop:8, flexWrap:'wrap', gap:12,
  },
  hintText: { fontSize:12, color:'#A8A29E', textAlign:'center' },
  btnGhost: {
    background:'#FFFFFF', color:'#1C1917', border:'1.5px solid #E7E5E4',
    borderRadius:10, padding:'10px 20px', fontSize:14, fontWeight:600,
    cursor:'pointer', fontFamily:'inherit',
  },
  btnOrange: {
    background:`linear-gradient(135deg, ${O}, ${OD})`, color:'#FFFFFF',
    border:'none', borderRadius:10, padding:'10px 24px',
    fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
    boxShadow:`0 3px 12px ${O}44`,
  },

  sidebar: {
    background:'#FFFFFF', border:'1.5px solid #E7E5E4', borderRadius:14,
    padding:16, position:'sticky', top:72,
    boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
  },
  sidebarHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  sidebarTitle: { fontSize:13, fontWeight:700, color:'#1C1917' },
  sidebarCount: {
    background:'#FFF7ED', border:'1px solid #FED7AA', borderRadius:20,
    padding:'2px 8px', fontSize:11, fontWeight:700, color:'#EA580C',
  },
  legend: { display:'flex', gap:10, marginBottom:12, flexWrap:'wrap' },
  legendItem: { display:'flex', alignItems:'center', gap:4, fontSize:11, color:'#78716C' },
  legendDot: { width:8, height:8, borderRadius:'50%', flexShrink:0 },
  dotGrid: { display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:6, marginBottom:16 },
  dotBtn: {
    aspectRatio:'1', borderRadius:8, cursor:'pointer', fontSize:11,
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:'inherit', transition:'all 0.15s', borderStyle:'solid',
  },
  sidebarSummary: {
    borderTop:'1px solid #F5F5F4', paddingTop:12,
    display:'flex', flexDirection:'column', gap:6,
  },
  summaryRow: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  summaryLabel: { fontSize:12, color:'#78716C' },
  summaryVal: { fontSize:13, fontWeight:700 },
  btnOrangeFull: {
    width:'100%', background:`linear-gradient(135deg, ${O}, ${OD})`, color:'#FFFFFF',
    border:'none', borderRadius:10, padding:'10px 0',
    fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
    boxShadow:`0 3px 12px ${O}44`,
  },
}
