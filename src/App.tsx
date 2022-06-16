import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateChallengeRoom from './components/CreateChallengeRoom';
import HomePage from './components/HomePage';
import JoinChallenge from './components/JoinChallenge';
import NotFound from './components/NotFound';
import theme from './Theme';
import { getTranslation, Language, Translation } from './translations';

function App() {
  const [translation, setTranslation] = useState<Translation>(getTranslation(localStorage.getItem("language") === null ? "en" 
  : localStorage.getItem("language") as Language));

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
