// Must come first: rewrites a GitHub Pages deep-link bounce back into a real
// path before the router reads window.location.
import './spaRestore.js'

// Clickjacking guard. GitHub Pages cannot send X-Frame-Options and CSP's
// frame-ancestors is ignored in <meta> form, so this is the only option here.
import './frameGuard.js'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
