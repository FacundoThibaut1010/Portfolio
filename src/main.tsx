import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { EffectsProvider } from './data/effects'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EffectsProvider>
      <App />
    </EffectsProvider>
  </StrictMode>,
)
