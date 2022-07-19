import { useMemo } from "react"
import { Box, Button, CssBaseline, PaletteMode, ThemeProvider, useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import CreateChallengeRoom from "./components/CreateChallengeRoom"
import HomePage from "./components/HomePage"
import JoinChallenge from "./components/JoinChallenge"
import NotFound from "./components/NotFound"
import makeTheme from "./Theme"
import { getTranslation, Language, Translation } from "./translations"
import LanguageContext from "./components/Context/LanguageContext"
import FeedbackModal from "./components/FeedbackModal"
import { ThemeVariables } from "./interfaces"


const App = () => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  
  const defaultTheme: ThemeVariables = {
    color: localStorage.getItem("theme") !== null ? JSON.parse(localStorage.getItem("theme")!).color : "green",
    mode: localStorage.getItem("theme") !== null ? JSON.parse(localStorage.getItem("theme")!).mode as PaletteMode : prefersDark ? "dark" : "light",
    style: localStorage.getItem("theme") !== null ? JSON.parse(localStorage.getItem("theme")!).style : "1"
  }
  const [translation, setTranslation] = useState<Translation>(getTranslation(localStorage.getItem("language") === null ? "en" : (localStorage.getItem("language") as Language)))
  const [themeOptions, setThemeOptions] = useState<ThemeVariables>(defaultTheme)
  const {color, mode, style} = themeOptions
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  if (localStorage.getItem("theme") === null && themeOptions !== null) localStorage.setItem("theme", JSON.stringify(themeOptions))

  useEffect(() => {
    // Subscribe to language changed event
    function event() {
      setTranslation(getTranslation(localStorage.getItem("language") as Language))
    }

    document.addEventListener("language-change", event)

    return () => {
      document.removeEventListener("language-change", event)
    }
  }, [])

  useEffect(() => {
    function event() {
      setThemeOptions(JSON.parse(localStorage.getItem("theme")!))
    }
    document.addEventListener("theme-change", event)

    return () => {
      document.removeEventListener("theme-change", event)
    }
  }, [])

  const theme = useMemo(() => makeTheme(mode, color, style), [mode, color, style])

  return (
    <LanguageContext.Provider value={translation}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage palette={theme.palette} />} />
              <Route path="game" element={<JoinChallenge />} />
              <Route path="create" element={<CreateChallengeRoom />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
          <Button id="feedback-btn" sx={{ width: "auto", position: "fixed", bottom: 0, left: 0, ml: 2, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} color="info" size="small" onClick={(e) => setFeedbackOpen(!feedbackOpen)}>
            {translation.inputs.buttons.feedback}
          </Button>
        </Box>
      </ThemeProvider>
    </LanguageContext.Provider>
  )
}

export default App
