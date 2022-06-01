import React, { useEffect, useState } from 'react';
import { ChallengeRoomJoin, ChallengeRoomJoinValidation } from '../interfaces';
import SettingsHomeButtons from './SettingsHomeButtons';
import {emojiArray, getEmojiImage} from './storage/Images'
import WaitingRoom from './WaitingRoom';
import { Button, TextField, Typography, Stack, Avatar } from '@mui/material';

const defaultFormData : ChallengeRoomJoin= {
  roomCode: "",
  userName: "",
  userAvatar: 1,
}

// const defautValidation : ChallengeRoomJoinValidation= {
//   isCodeValid: false,
//   isNameValid: true,
//   roomCodeHelperText: "Code must be 4 characters"
// }

function JoinChallenge() {
  const [info, setInfo] = useState<ChallengeRoomJoin>(defaultFormData); //form state
  const {roomCode, userName, userAvatar} = info; //form state
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [loading, setLoading] = useState(true); // placeholder loading screen
  const [isFormValid, setIsFormValid] = useState(true); //if true form inputs are not valid and button is disabled
  const [isCodeValid, setisCodeValid] = useState(false);
  const [roomCodeHelperText, setRoomCodeHelperText] = useState("Code must be 4 characters");
  // const [formValidation, setFormValidation] = useState<ChallengeRoomJoinValidation>(defautValidation);
  // const {isCodeValid, isNameValid, roomCodeHelperText} = formValidation;

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
        setLoading(false);
        if(res.statusCode !== 200)
        {
          console.log(res);
          sessionStorage.removeItem('token');
          setToken(sessionStorage.getItem('token'));
        }
        else
        {
          setShowWaitingRoom(true);
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
        setisCodeValid(false);  
        setLoading(false);
        setShowWaitingRoom(true);
      }
      else if(res.statusCode === 404) {
        setisCodeValid(true);
        setRoomCodeHelperText("Room code is invalid");
      }
      else{
        alert(res.statusCode);
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

  useEffect(() => {
    if(roomCode.length === 4 && userName.length >= 3 && userName.length <= 30)
      setIsFormValid(false);
    else
      setIsFormValid(true);
  },[roomCode, userName])

  return (
    <div>
      <SettingsHomeButtons />
      {loading && <></>}
      {showWaitingRoom && <WaitingRoom/>}
      {!loading && !showWaitingRoom && (
        <>
        <Stack  justifyContent="center" spacing={2} alignItems="center">
          <Typography variant="h2">Join a game</Typography>
          <Typography variant="body1">Ask the gamemaster for the code</Typography>
          <TextField 
            helperText={roomCodeHelperText}
            type="text"
            id="roomCode"
            label="Room code"
            onChange={onChange}
            value={roomCode}
            error={isCodeValid}>
          </TextField>
          <TextField
            helperText="Name must me between 3 and 30 characters"
            type="text"
            id="userName"
            label="Name"
            onChange={onChange}
            value={userName}>
          </TextField>
          <Typography variant="body1">Avatar</Typography>
          <Avatar variant="rounded" sx={{height: 200, width: 200}} onClick={avatarIndex} src={getEmojiImage(userAvatar)} alt="emoji" />
          <Button disabled={isFormValid} variant="contained" id="joinChallenge-btn" onClick={joinChallengeRoom}>Liity haasteeseen</Button>
        </Stack>
        </>
      )}
    </div>
  );
}

export default JoinChallenge;