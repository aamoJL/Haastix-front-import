import { useMemo } from "react";
import {
  Box,
  Button,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateChallengeRoom from "./components/CreateChallengeRoom";
import HomePage from "./components/HomePage";
import JoinChallenge from "./components/JoinChallenge";
import NotFound from "./components/NotFound";
import makeTheme from "./Theme";
import { getTranslation, Language, Translation } from "./translations";
import LanguageContext from "./components/Context/LanguageContext";
import FeedbackModal from "./components/FeedbackModal";

const App = () => {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [translation, setTranslation] = useState<Translation>(
    getTranslation(
      localStorage.getItem("language") === null
        ? "en"
        : (localStorage.getItem("language") as Language)
    )
  );
  const [mode, setMode] = useState<PaletteMode>(
    localStorage.getItem("mode") !== null
      ? (localStorage.getItem("mode") as PaletteMode)
      : prefersDark
      ? "dark"
      : "light"
  );
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  if (localStorage.getItem("mode") === null && mode !== null)
    localStorage.setItem("mode", mode);

  useEffect(() => {
    // Subscribe to language changed event
    function event() {
      setTranslation(
        getTranslation(localStorage.getItem("language") as Language)
      );
    }

    document.addEventListener("language-change", event);

    return () => {
      document.removeEventListener("language-change", event);
    };
  }, []);

  useEffect(() => {
    function event() {
      setMode(localStorage.getItem("mode") as PaletteMode);
    }
    document.addEventListener("mode-change", event);

    return () => {
      document.removeEventListener("mode-change", event);
    };
  });

  const theme = useMemo(() => makeTheme(mode), [mode]);

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
          <FeedbackModal
            open={feedbackOpen}
            onClose={() => setFeedbackOpen(false)}
          />
          <Button
            id="feedback-btn"
            sx={{
              width: "auto",
              position: "fixed",
              bottom: 0,
              left: 0,
              ml: 2,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
            color="info"
            size="small"
            onClick={(e) => setFeedbackOpen(!feedbackOpen)}
          >
            {translation.inputs.buttons.feedback}
          </Button>
        </Box>
      </ThemeProvider>
    </LanguageContext.Provider>
  );
};

export default App;
