import React, { useMemo } from 'react'
import { Box, CssBaseline, PaletteMode, ThemeProvider, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateChallengeRoom from './components/CreateChallengeRoom';
import HomePage from './components/HomePage';
import JoinChallenge from './components/JoinChallenge';
import NotFound from './components/NotFound';
import makeTheme from './Theme';
import { getTranslation, Language, Translation } from './translations';

const App= () => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [translation, setTranslation] = useState<Translation>(getTranslation(localStorage.getItem("language") === null ? "en" 
  : localStorage.getItem("language") as Language));
  const [mode, setMode] = useState<PaletteMode>(localStorage.getItem("mode") !== null ? localStorage.getItem("mode") as PaletteMode
    : prefersDark ? "dark"
    : "light"
  );

  if(localStorage.getItem("mode") === null && mode !== null)
    localStorage.setItem("mode", mode)

  useEffect(() => {
    // Subscribe to language changed event
    function event(){
      setTranslation(getTranslation(localStorage.getItem("language") as Language));
    }

    document.addEventListener("language-change", event);

    return () => {
      document.removeEventListener("language-change", event);
    }
  },[])

  useEffect(() => {
    function event() {
      setMode(localStorage.getItem("mode") as PaletteMode)
    }
    document.addEventListener("mode-change", event);

    return () => {
      document.removeEventListener("mode-change", event);
    }
  })

  const theme = useMemo(() =>  makeTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Box className='App'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage translation={translation} themeColor={theme.palette.primary}/>} />
            <Route path='game' element={<JoinChallenge translation={translation} />} />
            <Route path='create' element={<CreateChallengeRoom translation={translation} />} />
            <Route path='*' element={<NotFound />}/>
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
