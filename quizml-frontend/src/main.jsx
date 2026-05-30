import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Aktifkan dark mode untuk Tailwind darkMode: 'class'
document.documentElement.classList.add('dark')

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode dihapus — mencegah useEffect dipanggil 2x di development
  <App />
)
