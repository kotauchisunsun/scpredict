import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App"
import "@tensorflow/tfjs-backend-webgl"
import ReactGA from "react-ga4"

ReactGA.initialize("G-CY0SBJXLMC")

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App initialLineCount={800} />
  </React.StrictMode>,
)
