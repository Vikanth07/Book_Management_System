import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from '../src/landing_page/login/LoginPage.jsx'
import SignupPage from '../src/landing_page/signup/SignupPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <LoginPage /> */}
    <SignupPage />
  </StrictMode>,
)
