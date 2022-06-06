import React, { useEffect, useState } from 'react';
import { isConstructorDeclaration } from 'typescript';
import { ChallengeRoomJoin, JoinChallengeSuccessResponse } from '../interfaces';
import NotFound from './NotFound';
import SettingsHomeButtons from './SettingsHomeButtons';
import {emojiArray, getEmojiImage} from './storage/Images'
import WaitingRoom from './WaitingRoom';
import WaitingRoomViewGamemaster from './WaitingRoomViewGamemaster';
import { setConnection } from './socket';
import { Socket } from 'socket.io-client';

const defaultFormData : ChallengeRoomJoin= {
  roomCode: "",
  userName: "",
  userAvatar: 1,
}

function JoinChallenge() {
  const [currentSocket, setSocket] = useState<Socket | undefined>(undefined);
  const [info, setInfo] = useState<ChallengeRoomJoin>(defaultFormData); //form state
  const {roomCode, userName, userAvatar} = info; //form state
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [loading, setLoading] = useState(true); // placeholder loading screen
  const [roomInfo, setRoomInfo] = useState<JoinChallengeSuccessResponse>();

  const openWebsocket = (token: string) => {
    setSocket(setConnection(token))
}

  useEffect(() => {
    if(token !== null){
      // fetch room data
      fetch(`${process.env.REACT_APP_API_URL}/challenge/reJoin`,
      {
        method:"GET",
        headers: {
          Authorization: `bearer ${sessionStorage.getItem('token')}`,
        }
      })
      .then(res => res.json())
      .then(res => {
        if(res.statusCode !== 200)
        {
          sessionStorage.removeItem('token');
          setToken(sessionStorage.getItem('token'));
          setLoading(false);
        }
        else
        {
          setRoomInfo(res);
          openWebsocket(token);
          setShowWaitingRoom(true);
          setLoading(false);
        }
      })
      .catch(error => console.log(error))
    }
    else{
      setLoading(false);
    }
  }, [token]);


  const joinChallengeRoom = () => {
    //join game as a new player
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
    .then(res => {
      if(res.statusCode === 200)
      {
        setToken(res.details.token)
        if(res.details.token !== null)
          sessionStorage.setItem('token', res.details.token);
        setLoading(false);
        setShowWaitingRoom(true);
      }
    })
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
      {loading && <></>}
      {/* {showWaitingRoom && <WaitingRoom/>} */}
      {showWaitingRoom && roomInfo && <WaitingRoom roomInfo={roomInfo} socket={currentSocket}/>}
      {!loading && !showWaitingRoom && (
        <>
        <h1>Pääsykoodi</h1>
        <input type="text" id="roomCode" placeholder='Type room code' onChange={onChange} value={roomCode}></input>
        <p>Pyydä koodi pelimestarilta</p>
        <input type="text" id="userName" placeholder='Type your name' onChange={onChange} value={userName}></input>
        <p>Kuvake</p>
        <div>        
          <img onClick={avatarIndex} src={getEmojiImage(userAvatar)} alt="emoji" />
        </div>
        <button id="joinChallenge-btn" onClick={joinChallengeRoom}>Liity haasteeseen</button>
        </>
      )}
      
    </div>
  );
}

export default JoinChallenge;