import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateChallengeRoom from './components/CreateChallengeRoom';
import HomePage from './components/HomePage';
import JoinChallenge from './components/JoinChallenge';
import NotFound from './components/NotFound';
import WaitingRoomViewGamemaster from './components/WaitingRoomViewGamemaster';
import { getTranslation, Language, Translation } from './translation';
import theme from './Theme';

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
