import React, { useMemo } from 'react'
import { Box, CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CreateChallengeRoom from './components/CreateChallengeRoom';
import HomePage from './components/HomePage';
import JoinChallenge from './components/JoinChallenge';
import NotFound from './components/NotFound';
import makeTheme from './Theme';
import { getTranslation, Language, Translation } from './translations';

const App= () => {
  const [translation, setTranslation] = useState<Translation>(getTranslation(localStorage.getItem("language") === null ? "en" 
  : localStorage.getItem("language") as Language));
  const [mode, setMode] = useState<PaletteMode>("dark");

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
  
  const theme = useMemo(() =>  makeTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Box className='App'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage translation={translation}/>} />
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
