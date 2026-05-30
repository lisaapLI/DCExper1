import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Auth
export const register    = (payload) => api.post('/auth/register', payload)
export const login       = (payload) => api.post('/auth/login', payload)
export const getProfile  = (nim)     => api.get(`/auth/profile/${nim}`)
export const getHistory  = (nim)     => api.get(`/auth/history/${nim}`)

// Quiz
export const getQuestions = (level)   => {
  const params = level ? { level } : {}
  return api.get('/quiz/questions', { params })
}
export const submitQuiz = (payload)   => api.post('/quiz/submit', payload)

export default api
