import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getQuestions, submitQuiz } from '../api/quizApi'

export function useQuiz() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const timerRef  = useRef(null)

  // Ambil level dari state navigasi
  const level = location.state?.level || 'Mudah'

  const [questions,      setQuestions]     = useState([])
  const [currentIndex,   setCurrentIndex]  = useState(0)
  const [answers,        setAnswers]        = useState({})
  const [loading,        setLoading]        = useState(true)
  const [submitting,     setSubmitting]     = useState(false)
  const [error,          setError]          = useState(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    getQuestions(level)
      .then(res => {
        setQuestions(res.data.questions)
        setLoading(false)
      })
      .catch(() => {
        setError('Gagal memuat soal. Pastikan backend berjalan di http://localhost:5000')
        setLoading(false)
      })
  }, [level])

  useEffect(() => {
    if (!loading) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1)
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [loading])

  const selectAnswer = useCallback((questionId, choice) => {
    setAnswers(prev => ({ ...prev, [questionId]: choice }))
  }, [])

  const nextQuestion     = useCallback(() => setCurrentIndex(i => Math.min(i + 1, questions.length - 1)), [questions.length])
  const prevQuestion     = useCallback(() => setCurrentIndex(i => Math.max(i - 1, 0)), [])
  const jumpToQuestion   = useCallback((index) => setCurrentIndex(index), [])

  const handleSubmit = useCallback(async () => {
    clearInterval(timerRef.current)
    const student = JSON.parse(sessionStorage.getItem('quizml_user') || '{}')

    const payload = {
      nama:        student.nama,
      nim:         student.nim,
      level:       level,
      waktu_detik: elapsedSeconds,
      answers: questions.map(q => ({
        question_id: q.id,
        jawaban:     answers[q.id] || 'A',
      }))
    }

    try {
      setSubmitting(true)
      const res = await submitQuiz(payload)
      // Simpan result dengan info level
      sessionStorage.setItem('quizml_result', JSON.stringify({ ...res.data, level }))
      navigate('/result', { state: { level } })
    } catch {
      setError('Gagal submit. Coba lagi.')
      setSubmitting(false)
    }
  }, [answers, questions, elapsedSeconds, navigate, level])

  const answeredCount = Object.keys(answers).length
  const progress      = questions.length ? (answeredCount / questions.length) * 100 : 0
  const currentQ      = questions[currentIndex]

  return {
    questions, currentQ, currentIndex, level,
    answers, answeredCount, progress,
    loading, submitting, error,
    elapsedSeconds,
    selectAnswer, nextQuestion, prevQuestion, jumpToQuestion, handleSubmit,
  }
}
