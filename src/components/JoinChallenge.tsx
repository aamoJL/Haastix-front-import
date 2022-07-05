import React, { useEffect, useState } from 'react';
import { challengeModifyResponse, ChallengeRoomJoin, JoinChallengeSuccessResponse } from '../interfaces';
import { Socket } from 'socket.io-client';
import SettingsHomeButtons from './SettingsHomeButtons';
import { setConnection } from './socket';
import {emojiArray, getEmojiImage} from './storage/Images'
import WaitingRoom from './WaitingRoom';
import { Button, TextField, Typography, Stack, Avatar, Alert, Collapse, IconButton, Box, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Translation } from '../translations';

const defaultFormData : ChallengeRoomJoin = {
  roomCode: "",
  userName: "",
  userAvatar: 1,
}

const defaultRoomInfo: JoinChallengeSuccessResponse = {
  statusCode: 0,
  message: "",
  details: {
    userid: "",
    isGameMaster: false,
    challengeRoomId: "",
    challengeRoomCode: "",
    challengeRoomName: "",
    challengeStartDate: "",
    challengeEndDate: "",
    challengeTasks: [{ taskDescription: "", taskId: "", taskNumber: 0}],
    token: "",
    userName: "",
    userAvatar: 0,
  }
}

interface Props{
  translation: Translation
}

function JoinChallenge({translation} : Props) {
  const [currentSocket, setSocket] = useState<Socket | undefined>(undefined);
  const [info, setInfo] = useState<ChallengeRoomJoin>(defaultFormData); //form state
  const {roomCode, userName, userAvatar} = info; //form state
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);
  const [loading, setLoading] = useState(true); //placeholder loading screen
  const [formIsNotValid, setFormIsNotValid] = useState(true); //if true form inputs are not valid and button is disabled
  const [codeWasNotValid, setCodeWasNotValid] = useState(false); //if true code was not valid and code field is red
  const [openAlert, setOpenAlert] = useState(false); //if true show error alert
  const [roomInfo, setRoomInfo] = useState<JoinChallengeSuccessResponse>(defaultRoomInfo);
  const [openTooltip, setOpenTooltip] = useState(false);

  const openWebsocket = (token: string) => {
    setSocket(setConnection(token))
  }

  useEffect(() => {
    //rejoin challenge if token is found
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
          setRoomInfo(res);
          openWebsocket(token);
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
    setOpenAlert(false);
  }, [roomCode])

  useEffect(() => {
    if(roomCode.length === 4 && userName.length >= 3 && userName.length <= 30)
      setFormIsNotValid(false);
    else
      setFormIsNotValid(true);
  },[roomCode, userName])

  useEffect(() => {
    currentSocket?.on("challengeModify", (data: challengeModifyResponse)=> {
      setRoomInfo(prevState => ({
        ...prevState,
        details: {
          ...prevState.details,
          challengeTasks: data.challengeTasks
        }
      }))
    })

    return()=> {
      currentSocket?.off("challengeModify");
    }
  })

  const handleTooltip= () => {
    if(formIsNotValid)
      setOpenTooltip(!openTooltip);
    else
      setOpenTooltip(false);
  }

  return (
    <Box>
      <SettingsHomeButtons isLoggedIn={showWaitingRoom}/>
      {loading && <></>}
      {showWaitingRoom && roomInfo && <WaitingRoom roomInfo={roomInfo} socket={currentSocket} translation={translation}/>}
      {!loading && !showWaitingRoom &&
        <Stack  justifyContent="center" spacing={2} alignItems="center">
          <Typography variant="h3">{translation.titles.joinAGame}</Typography>
          <Typography variant="body1">{translation.texts.askCode}</Typography>
          <Collapse in={openAlert}>
            <Alert severity='error' 
            action={
              <IconButton size="small" id="close-alert-btn" aria-label="close-alert" onClick={() => {setOpenAlert(false)}}>
                <CloseIcon fontSize= "small"/>
              </IconButton>
            }>
              {translation.errors.roomCodeInvalid}
            </Alert>
          </Collapse>
          <TextField
            helperText={translation.inputs.texts.roomCodeDesc}
            type="text"
            id="roomCode"
            label={translation.inputs.texts.roomCode}
            onChange={onChange}
            value={roomCode}
            error={codeWasNotValid}
            inputProps={{maxLength: 4}}
            >
          </TextField>
          <TextField
            helperText={translation.inputs.texts.userNameDesc}
            type="text"
            id="userName"
            label={translation.inputs.texts.userName}
            onChange={onChange}
            value={userName}
            inputProps={{maxLength: 30}}
            >
          </TextField>
          <Typography variant="body1">{translation.titles.avatar}</Typography>
          <Avatar id="player_avatar" variant="rounded" sx={{height: 150, width: 150}} onClick={avatarIndex} src={getEmojiImage(userAvatar)} alt="emoji" />
          <Tooltip open={openTooltip} onOpen={handleTooltip} onClose={handleTooltip} enterDelay={0} title={translation.tooltips.joinGame}>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{width: 300}}>
              <Button disabled={formIsNotValid} variant="contained" id="joinChallenge-btn" onClick={joinChallengeRoom}>{translation.inputs.buttons.join}</Button>
            </Box>
          </Tooltip>
        </Stack>
      }
    </Box>
  );
}

export default JoinChallenge;