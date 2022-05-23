import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CreateChallengeRoom from './components/CreateChallengeRoom';
import HomePage from './components/HomePage';
import JoinChallenge from './components/JoinChallenge';
import NotFound from './components/NotFound';
import WaitingRoomViewGamemaster from './components/WaitingRoomViewGamemaster';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='join' element={<JoinChallenge />} />
          <Route path='create' element={<CreateChallengeRoom />} />
          <Route path='wait' element={<WaitingRoomViewGamemaster roomCode="a1B2" roomData={{
            roomName: "Test Room",
            challenges: [{description: "Test Challenge"}],
            time: undefined,
            delay: undefined,
          }}/>} />
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
