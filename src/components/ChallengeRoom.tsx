import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { JoinChallengeSuccessRespomse } from '../interfaces';

interface Props {
    roomInfo?: JoinChallengeSuccessRespomse,
}

interface SegmentedTime{
  days: number,
  hours: number,
  minutes: number,
  seconds: number
}

function ChallengeRoom(props: Props) {
  const endTime = new Date(props.roomInfo?.details.challengeEndDate as string);
  const isGameMaster = props.roomInfo?.details.username === undefined;
  
  /**
   * Returns object with segmented time between now and end date
   * @param delayTime end date
   * @returns segmentedTime object
   */
  const calculateTimeLeft = (delayTime: Date) => {
    const delay = delayTime.getTime() - new Date().getTime();
    let time : SegmentedTime = {
      days: Math.floor(delay / (1000 * 60 * 60 * 24)),
      hours: Math.floor((delay / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((delay / 1000 / 60) % 60),
      seconds: Math.floor((delay / 1000) % 60),
    };
    return time;
  }

  /**
   * Returns date string in "HH:MM:SS" format
   * @param time segmentedTime object
   * @returns formatted time string
   */
  const getFormattedTime = (time: SegmentedTime) => {
    let timeString;
    timeString = (time.hours < 10 ? "0" : "") + time.hours + ":";
    timeString = timeString + (time.minutes < 10 ? "0" : "") + time.minutes + ":";
    timeString = timeString + (time.seconds < 10 ? "0" : "") + time.seconds;
    return timeString;
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));
  const [currentTask, setCurrentTask] = useState(props.roomInfo?.details.challengeTasks[0]);

  // Game time timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);
  }, []);
  
  return (
    <div>
      {/* GameMaster */}
      {isGameMaster && 
        <>
          <Typography variant="body1" component="p">Käyttäjä: GameMaster</Typography>
          <Typography variant="body1" component="p">Huoneen koodi:<br/><b>{props.roomInfo?.details.challengeRoomCode}</b></Typography>
          <Typography variant="body1" component="p">Haaste: {(currentTask?.challengeNumber as number) + 1} / {props.roomInfo?.details.challengeTasks.length}</Typography>
          <Typography variant="body1" component="p">Haasteen kuvaus:<br/>{currentTask?.description}</Typography>
          <Typography variant="body1" component="p">Time left: {getFormattedTime(timeLeft)}</Typography>
        </>}
      {/* Player */}
      {!isGameMaster && 
        <>
          <Typography variant="body1" component="p">Käyttäjä: GameMaster</Typography>
          <Typography variant="body1" component="p">Haaste: {(currentTask?.challengeNumber as number) + 1} / {props.roomInfo?.details.challengeTasks.length}</Typography>
          <Typography variant="body1" component="p">Haasteen kuvaus:<br/>{currentTask?.description}</Typography>
          <Typography variant="body1" component="p">Time left: {getFormattedTime(timeLeft)}</Typography>
        </>}
    </div>
  );
}

export default ChallengeRoom;