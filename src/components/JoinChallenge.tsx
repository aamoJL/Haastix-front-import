import React, { useState } from 'react';
import { ChallengeRoomJoin } from '../interfaces';
import SettingsHomeButtons from './SettingsHomeButtons';
import {emojiArray, getEmojiImage} from './storage/Images'

function JoinChallenge() {
  const [info, setInfo] = useState<ChallengeRoomJoin>();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerAvatar, setAvatar] = useState(0);

  const setStuff = () => {
    setInfo({
      roomCode: roomCode,
      userName: playerName,
      userAvatar: playerAvatar
    })
  }

 const joinChallengeRoom = () => {
   fetch(`/challenge/join/` + "DwxD", {
     method: 'POST',
     headers: {'Conten-Type' : 'application/json'},
     body: JSON.stringify({
       userName: "playerName",
       userAvatar: "1"
     })
    }).then(async response => {
        // const isJson = response.headers.get('content-type')?.includes('application/json');
        // const data = isJson && await response.json();

        console.log(response);
    }).catch(error => {
        console.log("error", error)
   });
  }
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
      <button onClick={joinChallengeRoom}>Liity </button>
    </div>
  );
}

export default JoinChallenge;