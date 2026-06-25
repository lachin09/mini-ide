import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { LessonsPage } from './modules/lessons/LessonsPage'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LessonsPage />
  </StrictMode>,
)
