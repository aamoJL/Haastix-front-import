import { useEffect, useState } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { JoinChallengeSuccessResponse, WaitingRoomList, WaitingRoomNewPlayer} from '../interfaces';
import { Socket } from 'socket.io-client';
import {getEmojiImage} from './storage/Images'
import ChallengeRoom from './ChallengeRoom';
import ExitButton from './ExitButton';

interface Props {
  roomInfo: JoinChallengeSuccessResponse,
  socket?: Socket,
}

interface SegmentedTime{
  days: number,
  hours: number,
  minutes: number,
  seconds: number
}

function WaitingRoom({roomInfo, socket} : Props) {
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

  const isGameMaster = roomInfo.details.username === undefined;  
  const millisecondsLeft = new Date(roomInfo.details.challengeStartDate as string).getTime() - new Date().getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(millisecondsLeft));
  const [timeIsUp, setTimeIsUp] = useState(millisecondsLeft <= 0);
  const [playerArray, setPlayerArray]  = useState<WaitingRoomList[]>([]);

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
      // if (
      //   roomData.challengeRemainingDuration === 0 &&
      //   roomData.challengeRemainingDelay === 0
      // ) {
      //   clearInterval(intervalRef.current);
      //   setDelayEnded(true);
      //   intervalRef.current = null;
      // } else if (roomData.challengeRemainingDelay === 0) {
      //   //if delay is 0 show challengeroom
      //   setDelayEnded(true);
      //   setLoading(false);
      }
    );
  // socket.on("playerWasRemoved", (data) => {
    //   setRoomPlayers(data.players);
    //   });
    // }
    // get token
    // getToken();
    // // toggle loadingscreen
    // setLoading(false);
    return () => {
      // Clear socket.io Listeners , newPlayer
      socket?.off("newPlayer");
      // socket.off("playerWasRemoved");
    };
  }, []);

const avatars =
  playerArray && playerArray.length > 0
    ? playerArray.map((value, key) => {
        return (
          <div key={key}>
            <Stack alignItems="center">
              {value.name}
              <Avatar src={getEmojiImage(value.avatar)} alt="avatar" />
            </Stack>
          </div>
        );
      })
    : null;

  return (
    <div>
      {!timeIsUp && (
        <>
          <Typography id="room-name" variant="body1" component="p">Room name: {roomInfo.details.challengeRoomName}</Typography>
          <Typography id="timer-gm" variant="body1" component="p">Haasteen alkuun: {getFormattedTime(timeLeft)}</Typography>
          {isGameMaster &&
          <>
            <Typography id="room-code" variant="body1" component="p">Huone koodi : {roomInfo.details.challengeRoomCode}</Typography>
            <Typography id="task" variant="body1" component="p">First task : {roomInfo.details.challengeTasks[0].description}</Typography>
            <Typography id="player-joined" variant="body1" component="p">Pelaajia liittynyt : {playerArray.length}</Typography>
          </>}
          {!isGameMaster && <>
            {avatars}
          </>}
        </>
      )}
      {timeIsUp && <ChallengeRoom socket={socket} roomInfo={roomInfo}/>}
      <ExitButton/>
    </div>
  );
};

export default WaitingRoom;