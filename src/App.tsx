import './App.css';
import CreateChallengeRoom from './components/CreateChallengeRoom';
import HomePage from './components/HomePage';
import JoinChallenge from './components/JoinChallenge';
import WaitingRoomViewGamemaster from './components/WaitingRoomViewGamemaster';

function App() {
  return (
    <div className="App">
      <HomePage />
      {/* <CreateChallengeRoom /> */}
      {/* <WaitingRoomViewGamemaster roomCode="a1B2" roomData={{
        roomName: "Test Room",
        challenges: [{description: "Test Challenge"}],
        time: undefined,
        delay: undefined,
      }}/> */}
      {/* <JoinChallenge /> */}
    </div>
  );
}

export default App;
