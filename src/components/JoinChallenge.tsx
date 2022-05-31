import React, { useEffect, useState } from 'react';
import { ChallengeRoomJoin } from '../interfaces';
import SettingsHomeButtons from './SettingsHomeButtons';
import {emojiArray, getEmojiImage} from './storage/Images'
import WaitingRoom from './WaitingRoom';
import { Button, TextField, Typography, Stack, Avatar, Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const defaultFormData : ChallengeRoomJoin= {
  roomCode: "",
  userName: "",
  userAvatar: 1,
}

function JoinChallenge() {
  const [info, setInfo] = useState<ChallengeRoomJoin>(defaultFormData); //form state
  const {roomCode, userName, userAvatar} = info; //form state
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [loading, setLoading] = useState(true); // placeholder loading screen
  const [formIsNotValid, setFormIsNotValid] = useState(true); //if true form inputs are not valid and button is disabled
  const [codeWasNotValid, setCodeWasNotValid] = useState(false); // if true code was not valid and code field is red
  const [openAlert, setOpenAlert] = useState(false); // if true show error alert

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
        setCodeWasNotValid(false);  
        setLoading(false);
        setShowWaitingRoom(true);
      }
      else if(res.statusCode === 404) {
        setCodeWasNotValid(true);
        setOpenAlert(true);
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
    setCodeWasNotValid(false);
    if(roomCode.length === 4 && userName.length >= 3 && userName.length <= 30)
      setFormIsNotValid(false);
    else
      setFormIsNotValid(true);
  },[roomCode, userName])

  return (
    <div>
      <SettingsHomeButtons/>
      {loading && <></>}
      {showWaitingRoom && <WaitingRoom/>}
      {!loading && !showWaitingRoom && (
        <>
        <Stack  justifyContent="center" spacing={2} alignItems="center">
          <Typography variant="h2">Join a game</Typography>
          <Typography variant="body1">Ask the gamemaster for the code</Typography>
          <Collapse in={openAlert}>
            <Alert severity='error' 
            action={
              <IconButton id="close-alert-btn" aria-label="close-alert" onClick={() => {setOpenAlert(false)}}>
                <CloseIcon/>
              </IconButton>
            }>
              Room Code was invalid!
            </Alert>
          </Collapse>
          <TextField 
            helperText="Code must be 4 characters"
            type="text"
            id="roomCode"
            label="Room code"
            onChange={onChange}
            value={roomCode}
            error={codeWasNotValid}>
          </TextField>
          <TextField
            helperText="Name must me between 3 and 30 characters"
            type="text"
            id="userName"
            label="User name"
            onChange={onChange}
            value={userName}>
          </TextField>
          <Typography variant="body1">Avatar</Typography>
          <Avatar variant="rounded" sx={{height: 200, width: 200}} onClick={avatarIndex} src={getEmojiImage(userAvatar)} alt="emoji" />
          <Button disabled={formIsNotValid} variant="contained" id="joinChallenge-btn" onClick={joinChallengeRoom}>Liity haasteeseen</Button>
        </Stack>
        </>
      )}
    </div>
  );
}

export default JoinChallenge;