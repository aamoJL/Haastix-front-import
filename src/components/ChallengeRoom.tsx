import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { JoinChallengeSuccessRespomse } from '../interfaces';

interface Props {
    roomInfo?: JoinChallengeSuccessRespomse,
}

function ChallengeRoom(props: Props) {
  const endTime = new Date(Date.parse(props.roomInfo?.details.challengeEndDate as string));
  
  const [timeLeft, setTimeLeft] = useState(endTime.getTime() - new Date().getTime());
  const [currentTask, setCurrentTask] = useState(props.roomInfo?.details.challengeTasks[0]);

  const isGameMaster = props.roomInfo?.details.username === undefined;

  // Game time timer
  useEffect(() => {
    const interval = setInterval(() => {
      let newTime = endTime.getTime() - new Date().getTime();
      setTimeLeft(newTime);
    }, 1000);
  }, []);
  
  return (
    <div>
      {/* GameMaster */}
      {isGameMaster && 
        <>
          <Typography variant="h3" component="h2">Käyttäjä: GameMaster</Typography>
          <p>Huoneen koodi:<br/>{props.roomInfo?.details.challengeRoomCode}</p>
          <p>Haaste: {(currentTask?.challengeNumber as number) + 1} / {props.roomInfo?.details.challengeTasks.length}</p>
          <p>Haasteen kuvaus:<br/>{currentTask?.description}</p>
          <p>Time left: {new Date(timeLeft).toLocaleTimeString()}</p>
        </>}
      {/* Player */}
      {!isGameMaster && 
        <>
          <p>Käyttäjä: {props.roomInfo?.details.username}</p>
          <p>Haaste: {(currentTask?.challengeNumber as number) + 1} / {props.roomInfo?.details.challengeTasks.length}</p>
          <p>Haasteen kuvaus:<br/>{currentTask?.description}</p>
          <p>Time left: {new Date(timeLeft).toLocaleTimeString()}</p>
        </>}
    </div>
  );
}

export default ChallengeRoom;