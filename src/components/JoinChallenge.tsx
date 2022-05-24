import React, { useState } from 'react';
import { ChallengeRoomJoin } from '../interfaces';
import SettingsHomeButtons from './SettingsHomeButtons';
import {emojiArray, getEmojiImage} from './storage/Images'

function JoinChallenge() {
  const [info, setInfo] = useState<ChallengeRoomJoin>();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerAvatar, setAvatar] = useState(0);

  const setStuff = () => 
    setInfo({
      roomCode: roomCode,
      userName: playerName,
      userAvatar: playerAvatar
    })

    const avatarIndex = () =>     
    {
      if(emojiArray.length > playerAvatar + 1){
      setAvatar(playerAvatar + 1);
      }
      else (
        setAvatar(0)
      )
    }

  return (
    <div>
      <SettingsHomeButtons />
      <h1>Pääsykoodi</h1>
      <input type="text" id="roomCode" placeholder='Type room code' onChange={(e) => setRoomCode(e.target.value)} value={roomCode}></input>
      <p>Pyydä koodi pelimestarilta</p>
      <input type="text" id="playerName" placeholder='Type your name' onChange={(e) => setPlayerName(e.target.value)} value={playerName}></input>
      <p>Kuvake</p>
      <div>        
        <img onClick={avatarIndex} src={getEmojiImage(playerAvatar)} />
      </div>
      <button id="joinChallenge-btn" onClick={setStuff}>Liity haasteeseen</button>
    </div>
  );
}

export default JoinChallenge;