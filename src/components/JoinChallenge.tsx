import React, { useState } from 'react';
import { ChallengeRoomJoin } from '../interfaces';
import SettingsHomeButtons from './SettingsHomeButtons';
import {emojiArray, getEmojiImage} from './storage/Images'

const defaultFormData : ChallengeRoomJoin= {
  roomCode: "",
  userName: "",
  userAvatar: 1,
}

function JoinChallenge() {
  const [info, setInfo] = useState<ChallengeRoomJoin>(defaultFormData);
  const {roomCode, userName, userAvatar} = info;

 const joinChallengeRoom = () => {
   fetch(`${process.env.REACT_APP_API_URL}/challenge/join/${roomCode}`, 
      {
        method: "POST",
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          userName: userName,
          userAvatar: userAvatar.toString()
        })
      }
    )
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(error => alert(error))
  }
  
  const avatarIndex = () =>     
  {
    if(emojiArray.length > userAvatar + 1){
    setInfo((prevState) => ({
      ...prevState,
      userAvatar: userAvatar +1,
    }));
    }
    else (
      setInfo((prevState) => ({
        ...prevState,
        userAvatar: 0,
      }))
    )
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  return (
    <div>
      <SettingsHomeButtons />
      <h1>Pääsykoodi</h1>
      <input type="text" id="roomCode" placeholder='Type room code' onChange={onChange} value={roomCode}></input>
      <p>Pyydä koodi pelimestarilta</p>
      <input type="text" id="userName" placeholder='Type your name' onChange={onChange} value={userName}></input>
      <p>Kuvake</p>
      <div>        
        <img onClick={avatarIndex} src={getEmojiImage(userAvatar)} alt="emoji" />
      </div>
      <button id="joinChallenge-btn" onClick={joinChallengeRoom}>Liity haasteeseen</button>
    </div>
  );
}

export default JoinChallenge;