import React, { useEffect, useState } from 'react';
import { Avatar, Button, Collapse, Stack, Typography, TableBody, TableRow, Table, TableCell, TextField, ButtonGroup, IconButton, Box, TableContainer, TableHead, SxProps, Theme } from '@mui/material';
import { Challenge, JoinChallengeSuccessResponse, WaitingRoomList, WaitingRoomNewPlayer, YouWereRemovedResponse} from '../interfaces';
import { Socket } from 'socket.io-client';
import {getEmojiImage} from './storage/Images'
import ChallengeRoom from './ChallengeRoom';
import RemovePlayer from './RemovePlayer';
import AlertWindow from './AlertWindow';
import CloseIcon from '@mui/icons-material/Close'
import { Translation } from '../translations';

interface Props {
  roomInfo: JoinChallengeSuccessResponse,
  socket?: Socket,
  translation: Translation,
}

interface SegmentedTime{
  days: number,
  hours: number,
  minutes: number,
  seconds: number
}

function WaitingRoom({roomInfo, socket, translation} : Props) {
  /**
   * Returns object with segmented time between now and end date
   * @param delayTime end date
   * @returns segmentedTime object
  */
  const calculateTimeLeft = (milliseconds: number) => {
    let time : SegmentedTime = {
      days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
      hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((milliseconds / 1000 / 60) % 60),
      seconds: Math.floor((milliseconds / 1000) % 60),
    };
    return time;
  }

  /**
 * Returns date string in "(-)HH:MM:SS" format
 * @param time segmentedTime object
 * @returns formatted time string
 */
  const getFormattedTime = (time: SegmentedTime) => {
    let timeString = (time.days + time.hours + time.minutes + time.seconds < 0) ? "-" : "";
    timeString = timeString + (Math.abs(time.hours) < 10 ? "0" : "") + Math.abs(time.hours) + ":";
    timeString = timeString + (Math.abs(time.minutes) < 10 ? "0" : "") + Math.abs(time.minutes) + ":";
    timeString = timeString + (Math.abs(time.seconds) < 10 ? "0" : "") + Math.abs(time.seconds);
    return timeString;
  }

  const tableHeaderStyle : SxProps<Theme> = {
    backgroundColor: "primary.main", 
    color: "primary.contrastText",
    borderBottomColor: "primary.contrastText"
  }

  const isGameMaster = roomInfo.details.username === undefined;
  const millisecondsLeft = new Date(roomInfo.details.challengeStartDate as string).getTime() - new Date().getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(millisecondsLeft));
  const [timeIsUp, setTimeIsUp] = useState(millisecondsLeft <= 0);
  const [playerArray, setPlayerArray]  = useState<WaitingRoomList[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertWindow, setAlertWindow] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [edit, setEdit] = useState(false);
  const [challengeArray, setChallengeArray] = useState<Challenge[]>(roomInfo.details.challengeTasks);

  useEffect(() => {
    const interval = setInterval(() => {
    const endDate = new Date(roomInfo.details.challengeStartDate as string);
    const milliseconds = endDate.getTime() - new Date().getTime();
    const segmentedTime = calculateTimeLeft(milliseconds);
    setTimeLeft(segmentedTime);
    if(milliseconds <= 0){
      setTimeIsUp(true);
      clearInterval(interval);
    }
    }, 1000);
    return () => {
      clearInterval(interval);
    }
  }, [roomInfo.details.challengeStartDate]);

  useEffect(() => {
    // Set Socket.io Listeners | newPlayer listener
    socket?.on("newPlayer", (data: WaitingRoomNewPlayer) => {
      // set players from data to players
      setPlayerArray(data.players);
        // set loading false
        // setLoading(false);
    });

    socket?.on("youWereRemoved", (data: YouWereRemovedResponse) => {
          sessionStorage.removeItem("token");
          setAlertMessage(data.message);
          setAlertWindow(true);
        }
      );

    socket?.on("playerWasRemoved", (data: WaitingRoomNewPlayer) => {
      setPlayerArray(data.players);
    });

    // get token
    // getToken();
    // toggle loadingscreen
    // setLoading(false);
    return () => {
      // Clear socket.io Listeners , newPlayer
      socket?.off("newPlayer");
      socket?.off("playerWasRemoved");
      socket?.off("youWereRemoved");
    };
  });

  const handleShowPlayers = () => {
    setShowChallenges(false);
    setShowPlayers(!showPlayers);
  }

  const handleShowChallenges = () => {
    setShowPlayers(false);
    setShowChallenges(!showChallenges);
    setEdit(false);
  }

  const handleEditView = () => {
    setChallengeArray(roomInfo.details.challengeTasks);
    setEdit(true);
  }

  const handleEditChallenge = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newArray = challengeArray.map(challenge => {
      if(challenge.challengeNumber === index)
      {
        return {...challenge, description: e.target.value}
      }
      return challenge;
    })
    setChallengeArray(newArray);
  }

  const handleAddChallenge = () => {
    const newArr = challengeArray.concat({description: "", challengeNumber: challengeArray.length})
    const fixedArr = changeChallengeNumbers(newArr);
    setChallengeArray(fixedArr);
  }

  const handleRemoveChallenge = (i: number) => {
    const newArr = challengeArray.filter(challenge => challenge.challengeNumber !== i);
    if(newArr.length < 1)
      setChallengeArray([{description:"", challengeNumber: 0}]);
    else{
      const fixedArr = changeChallengeNumbers(newArr);
      setChallengeArray(fixedArr);
    }
  }

  const changeChallengeNumbers = (arr: Challenge[]) => {
    const newArr = arr.map((challenge, index) => {
      return {...challenge, challengeNumber: index}
    })
    return newArr;
  }

  const handleSaveChallenges = () => {
    const filteredArr = challengeArray.filter(challenge => challenge.description !== "");
    setChallengeArray(filteredArr);

    socket?.emit("modifyChallenge", {
      token: roomInfo.details.token,
      payload: {
        challengeName: roomInfo.details.challengeRoomName,
        challengeTasks: filteredArr
      }
    });

    setEdit(false)
  }

  return (
    <Stack alignItems="center" justifyContent="center" spacing={1}>
      {!timeIsUp && !alertWindow && (
        <>
          <Typography variant="h3" component="h3">{translation.titles.waitingRoom}</Typography>
          <Box sx={{display:"grid", gridTemplateColumns: 'repeat(2, 1fr)', maxWidth:380}} textAlign="left" columnGap={3} pl={8}>
            <Typography variant="body1" component="p">{translation.texts.roomName}</Typography>
            <Typography id="room-name" variant="body1" component="p" sx={{textOverflow:"ellipsis", overflow:"hidden"}}>{roomInfo.details.challengeRoomName}</Typography>
            <Typography variant="body1" component="p">{translation.texts.challengeBeginsIn}</Typography>
            <Typography id="timer-gm" variant="body1" component="p">{getFormattedTime(timeLeft)}</Typography>
            {isGameMaster &&
            <>
              <Typography id="room-code" variant="body1" component="p">{translation.texts.roomCode}</Typography>
              <Typography id="room-code" variant="body1" component="p"><b>{roomInfo.details.challengeRoomCode}</b></Typography>
              <Typography id="task" variant="body1" component="p">{translation.texts.firstChallenge}</Typography>
              <Typography id="task" variant="body1" component="p" sx={{textOverflow:"ellipsis", overflow:"hidden"}}>{roomInfo.details.challengeTasks[0].description}</Typography>
              </>}
          </Box>
          {isGameMaster && <>
            <ButtonGroup>
              <Button id="show-players-btn" onClick={handleShowPlayers}>{translation.inputs.buttons.players} ({playerArray.length})</Button>
              <Button id="show-challenges-btn" onClick={handleShowChallenges}>{translation.inputs.buttons.challenges} ({roomInfo.details.challengeTasks.length})</Button>
            </ButtonGroup>
            <RemovePlayer socket={socket} roomInfo={roomInfo} playerArray={playerArray} open={showPlayers} translation={translation} />
            <Collapse in={showChallenges} unmountOnExit>
              {!edit && <Stack alignItems="center" >
                {
                  <TableContainer sx={{maxWidth: 300, overflow: 'hidden'}}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={tableHeaderStyle}>#</TableCell>
                          <TableCell sx={tableHeaderStyle}>{translation.tables.description}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roomInfo.details.challengeTasks.map((value, i) => (
                          <TableRow key={i}> 
                            <TableCell align="left">
                              <Typography variant="body1" component="p">{value.challengeNumber +1}</Typography>
                            </TableCell>  
                            <TableCell align="left">
                              {value.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                }
                <Button id="edit-btn" variant="text" onClick={handleEditView}>{translation.inputs.buttons.edit}</Button>
              </Stack>}
              {edit && 
              <Box sx={{maxHeight: 255, overflow: 'auto', maxWidth: 300}}>
                {challengeArray.map((value, i) => (
                  <TextField
                    key={i}
                    autoFocus
                    id={`challenge-edit-input-${i}`}
                    sx={{mb:1}}
                    value={value.description}
                    size="small"
                    multiline
                    onChange={(e)=>handleEditChallenge(e, i)}
                    inputProps={{maxLength: 256}}
                    InputProps={{
                      endAdornment: (
                        <IconButton color='error' onClick={()=>handleRemoveChallenge(i)}>
                          <CloseIcon/>
                        </IconButton>
                      )
                    }}
                  ></TextField>
                  ))}
                </Box>}
                {edit && <ButtonGroup variant="text">
                  <Button id="add-challenge-btn" onClick={handleAddChallenge}>{translation.inputs.buttons.add}</Button>
                  <Button id="save-challenges-btn" onClick={handleSaveChallenges}>{translation.inputs.buttons.save}</Button>
                </ButtonGroup>}
            </Collapse>
          </>}
          {!isGameMaster && playerArray.length > 0 && 
            <Table sx={{maxWidth: 200}} size="small">
              <TableBody>
                {playerArray.map((value, i) => (
                  <TableRow key={i}> 
                    <TableCell align="left">
                      <Avatar src={getEmojiImage(value.avatar)} alt="avatar" />
                    </TableCell>  
                    <TableCell align="left">
                      {value.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        </>
      )}
      {timeIsUp && <ChallengeRoom socket={socket} roomInfo={roomInfo} playerArray={playerArray} translation={translation}/>}
      {alertWindow && <AlertWindow message={alertMessage}/>}
    </Stack>
  );
};

export default WaitingRoom;