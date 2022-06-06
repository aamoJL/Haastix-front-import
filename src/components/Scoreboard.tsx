import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { PlayerData } from '../interfaces';
import { getEmojiImage } from './storage/Images';

interface Props{
  socket?: Socket,
}

/**
 * Component that renders challenge room's scoreboard sorted by task completion time
 * @param socket Socket.io socket connection
 */
function Scoreboard({socket}: Props) {
  const [scores, setScores] = useState<PlayerData[]>([]);

  useEffect(() => {
    socket?.emit("fetchScoreBoard", {
      token: sessionStorage.getItem("token"),
    });
    socket?.on("finalScore_update", (res: PlayerData[]) => {
      console.log(res);
      let players = res;
      // Sort players by time
      players.sort((a,b) => {
        if(a.playerFileIds.length === b.playerFileIds.length){
          // If players have same amount of tasks completed
          return a.totalTime < b.totalTime ? -1 : a.totalTime > b.totalTime ? 1 : 0;
        }
        else{
          // If players other player have more tasks completed
          return a.playerFileIds.length > b.playerFileIds.length ? -1 : 1;
        }
      })
      setScores(players);
    });
    
    return () => {
      // Clear socket.io Listeners
      socket?.off("finalScore_update");
    };
  }, []);

  let scoreElements = scores.map((player, i) => {
    return (
      <Stack alignItems="center" key={player.playerName}>
        <Avatar src={getEmojiImage(parseInt(player.playerAvatar))} alt="avatar" />
        <Box>{player.playerName}</Box>
        <Box>{player.totalTime}s / {player.playerFileIds.length} tasks</Box>
      </Stack>
    )
  })

  return (
    <Box>
      {scores.length === 0 && "There are no players in the room :("}
      <Typography id="times-up-title" variant="body1" component="p">Scoreboard</Typography>
      {scoreElements}
    </Box>
  );
}

export default Scoreboard;