import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { JoinChallengeSuccessRespomse } from '../interfaces';
import ChallengeRoomCamera from './ChallengeRoomCamera';

interface Props {
    roomInfo?: JoinChallengeSuccessRespomse,
    socket?: Socket
}

interface SegmentedTime{
  days: number,
  hours: number,
  minutes: number,
  seconds: number
}

/**
 * Component that renders game view for given room information.
 * Room's scoreboard will be rendered if the room's game time is up.
 * Players and Game master will have different views.
 * @param roomInfo reJoin API response
 */
function ChallengeRoom({roomInfo, socket} : Props) {
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
  
  const isGameMaster = roomInfo?.details.username === undefined;
  const millisecondsLeft = new Date(roomInfo?.details.challengeEndDate as string).getTime() - new Date().getTime();
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(millisecondsLeft));
  const [currentTask, setCurrentTask] = useState(roomInfo?.details.challengeTasks[0]);
  const [timeIsUp, setTimeIsUp] = useState(millisecondsLeft <= 0);
  const [showCamera, setShowCamera] = useState(false);

  // Game time timer
  useEffect(() => {
    const interval = setInterval(() => {
      const endDate = new Date(roomInfo?.details.challengeEndDate as string);
      const milliseconds = endDate.getTime() - new Date().getTime();
      const segmentedTime = calculateTimeLeft(milliseconds);
      setTimeLeft(segmentedTime);
      if(milliseconds <= 0){
        setTimeIsUp(true);
        clearInterval(interval);
      }
    }, 1000);

    // Player
    if(!isGameMaster){
      socket?.on("fileStatusPlayer", dataResponse => {
        console.log(dataResponse);
      })
  
      socket?.emit('playerCheckFile', {
        token: roomInfo?.details.token,
        payload: {
            challengeNumber: 0
        }
      })
    }

    // Gamemaster
    if(isGameMaster){
      socket?.on("newFile", dataResponse => {
        console.log(dataResponse);
      })
      
      socket?.emit('listFiles', {
        token: roomInfo?.details.token,
      })
    }
    
    return () => {
      clearInterval(interval);
      socket?.off("fileStatusPlayer")
      socket?.off("newFile");
    }
  }, [roomInfo?.details.challengeEndDate]);
  
  return (
    <div>
      {/* GameMaster */}
      {isGameMaster && !timeIsUp &&
        <>
          <Typography id="user-title-gm" variant="body1" component="p">Käyttäjä: GameMaster</Typography>
          <Typography id="room-code-title-gm" variant="body1" component="p">Huoneen koodi:<br/><b>{roomInfo?.details.challengeRoomCode}</b></Typography>
          <Typography id="task-title-gm" variant="body1" component="p">Haaste: <span id="current-task-number-gm">{(currentTask?.challengeNumber as number) + 1}</span> / <span id="challenge-count-number-gm">{roomInfo?.details.challengeTasks.length}</span></Typography>
          <Typography id="task-description-gm" variant="body1" component="p">Haasteen kuvaus:<br/>{currentTask?.description}</Typography>
          <Typography id="timer-gm" variant="body1" component="p">Aikaa jäljellä: {getFormattedTime(timeLeft)}</Typography>
        </>}
      {/* Player */}
      {!isGameMaster && !timeIsUp &&
        <>
          <Typography id="user-title-player" variant="body1" component="p">Käyttäjä: {roomInfo.details.username}</Typography>
          <Typography id="task-title-player" variant="body1" component="p">Haaste: <span id="current-task-number-player">{(currentTask?.challengeNumber as number) + 1}</span> / <span id="challenge-count-number-player">{roomInfo?.details.challengeTasks.length}</span></Typography>
          <Typography id="task-description-player" variant="body1" component="p">Haasteen kuvaus:<br/>{currentTask?.description}</Typography>
          <Typography id="timer-player" variant="body1" component="p">Aikaa jäljellä: {getFormattedTime(timeLeft)}</Typography>
          <Button onClick={(e) => setShowCamera(!showCamera)}>{showCamera ? "Sulje kamera" : "Näytä kamera"}</Button>
          {showCamera && currentTask && <ChallengeRoomCamera taskNumber={currentTask.challengeNumber}/>}
        </>}
      {/* Time is up, scoreboard */}
      {timeIsUp && 
        <>
          <Typography id="times-up-title" variant="h2" component="h2">Haaste on päättynyt!</Typography>
        </>}
    </div>
  );
}

export default ChallengeRoom;