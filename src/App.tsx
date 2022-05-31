import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateChallengeRoom from './components/CreateChallengeRoom';
import HomePage from './components/HomePage';
import JoinChallenge from './components/JoinChallenge';
import NotFound from './components/NotFound';
import WaitingRoomViewGamemaster from './components/WaitingRoomViewGamemaster';
import theme from './Theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Box className='App'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />} />
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
