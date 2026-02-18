import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import emailjs from '@emailjs/browser'

// ✅ Initialize EmailJS once at app startup
emailjs.init('owVDz9Fo3FQoYw3_x')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
