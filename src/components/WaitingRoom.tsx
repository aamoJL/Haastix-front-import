import { useEffect, useState } from 'react';
import { Avatar, Button, Collapse, Stack, Typography, TableBody, TableRow, Table, TableCell } from '@mui/material';
import { JoinChallengeSuccessResponse, WaitingRoomList, WaitingRoomNewPlayer, YouWereRemovedResponse} from '../interfaces';
import { Socket } from 'socket.io-client';
import {getEmojiImage} from './storage/Images'
import ChallengeRoom from './ChallengeRoom';
import { useNavigate } from 'react-router-dom';
import RemovePlayer from './RemovePlayer';
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
  const [openPlayers, setOpenPlayers] = useState(false);

  const navigation = useNavigate();

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
      }
    );

    socket?.on("youWereRemoved", (data: YouWereRemovedResponse) => {
        if(data.statusCode === 200) {
          sessionStorage.removeItem("token");
          alert("You were removed from the game");
          navigation("/");
        }
      });

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

  return (
    <Stack alignItems="center" justifyContent="center" spacing={1}>
      {!timeIsUp && (
        <>
          <Typography id="room-name" variant="body1" component="p">Room name: {roomInfo.details.challengeRoomName}</Typography>
          <Typography id="timer-gm" variant="body1" component="p">Haasteen alkuun: {getFormattedTime(timeLeft)}</Typography>
          {isGameMaster &&
          <>
            <Typography id="room-code" variant="body1" component="p">Huone koodi : {roomInfo.details.challengeRoomCode}</Typography>
            <Typography id="task" variant="body1" component="p">First task : {roomInfo.details.challengeTasks[0].description}</Typography>
            <Button onClick={()=>setOpenPlayers(!openPlayers)}>Players ({playerArray.length})</Button>
              <Collapse in={openPlayers} unmountOnExit>
                <RemovePlayer socket={socket} roomInfo={roomInfo} playerArray={playerArray}/>
              </Collapse>
            <Button>Challenges</Button>
          </>}
          {!isGameMaster && playerArray.length > 0 && <>
            <Table sx={{maxWidth: 2e00}} size="small">
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
            </>
          }
        </>
      )}
      {timeIsUp && <ChallengeRoom socket={socket} roomInfo={roomInfo}/>}
      {!timeIsUp && <ExitButton/>}
    </Stack>
  );
};

export default WaitingRoom;