import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App"
import "@tensorflow/tfjs-backend-webgl"
import ReactGA from "react-ga4"
import { config } from "./PredictConfig"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

ReactGA.initialize("G-CY0SBJXLMC")

const darkTheme = createTheme({
  palette: {
    mode: "light",
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App predictConfig={config} startDate={new Date()} />
  </ThemeProvider>,
)
