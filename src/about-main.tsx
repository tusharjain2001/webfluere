import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/schibsted-grotesk'
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/500.css'
import AboutPage from './pages/about.tsx'
import './style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AboutPage />
  </StrictMode>,
)
