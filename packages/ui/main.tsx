import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'
import '@tensorflow/tfjs-backend-webgl';
import ReactGA from "react-ga4"

ReactGA.initialize("G-CY0SBJXLMC")

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
