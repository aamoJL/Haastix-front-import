import React, { useState } from 'react';
import PlayerIcon from '../assets/player_emojies/002-cool-5.png';
import SettingsHomeButtons from './SettingsHomeButtons';

function JoinChallenge() {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  return (
    <div>
      <SettingsHomeButtons />
      <h1>Pääsykoodi</h1>
      <input type="text" id="roomCode" placeholder='Type room code' onChange={(e) => setRoomCode(e.target.value)} value={roomCode}></input>
      <p>Pyydä koodi pelimestarilta</p>
      <input type="text" id="playerName" placeholder='Type your name' onChange={(e) => setPlayerName(e.target.value)} value={playerName}></input>
      <p>Kuvake</p>
      <div>
        <img src={PlayerIcon} alt="" />
      </div>
      <button id="joinChallenge-btn">Liity haasteeseen</button>
    </div>
  );
}

export default JoinChallenge;