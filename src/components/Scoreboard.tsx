import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface Props{
  socket?: Socket,
}

function Scoreboard({socket}: Props) {
  const [scores, setScores] = useState([]);


  useEffect(() => {
    socket?.emit("fetchScoreBoard", {
      token: sessionStorage.getItem("token"),
    });
    socket?.on("finalScore_update", (res) => {
      console.log(res);
      setScores(res);
    });
    
    return () => {
      // Clear socket.io Listeners
      socket?.off("finalScore_update");
    };
  }, []);

  return (
    <div>
      <Typography id="times-up-title" variant="body1" component="p">Scoreboard</Typography>
      <div>
      </div>
    </div>
  );
}

export default Scoreboard;