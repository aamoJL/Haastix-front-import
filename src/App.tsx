import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateChallengeRoom from './components/CreateChallengeRoom';
import HomePage from './components/HomePage';
import JoinChallenge from './components/JoinChallenge';
import NotFound from './components/NotFound';
import WaitingRoomViewGamemaster from './components/WaitingRoomViewGamemaster';
import { Language } from './Translation';
import theme from './Theme';

function App() {
  const [language, setLanguage] = useState<Language>(localStorage.getItem("language") === null ? "en" : localStorage.getItem("language") as Language);

  useEffect(() => {
    // Subscribe to language changed event
    function event(){
      setLanguage(localStorage.getItem("language") as Language);
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
            <Route path='/' element={<HomePage language={language}/>} />
            <Route path='game' element={<JoinChallenge />} />
            <Route path='create' element={<CreateChallengeRoom />} />
            <Route path='wait' element={<WaitingRoomViewGamemaster roomCode="a1B2" roomData={{
              roomName: "Test Room",
              challenges: [{description: "Test Challenge", challengeNumber: 0}],
              time: 10,
              delay: 10,
            }}/>} />
            <Route path='*' element={<NotFound />}/>
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
