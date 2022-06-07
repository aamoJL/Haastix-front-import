import React from 'react';
import CloseIcon from '@mui/icons-material/Close'
import { IconButton, List, ListItem, Typography } from '@mui/material';
import { JoinChallengeSuccessResponse, WaitingRoomList} from '../interfaces';
import { Socket } from 'socket.io-client';

interface Props {
  socket?: Socket,
  roomInfo: JoinChallengeSuccessResponse,
  playerArray: WaitingRoomList[]
}

function RemovePlayer({socket, roomInfo, playerArray} : Props) {  

  const handleRemovePlayer = (userName: string) => {
    socket?.emit("removePlayer", {
      token: roomInfo.details.token,
      payload: {
        userName: userName,
      },
    });
    }  
  
  return (
    <List dense>
      {playerArray.length === 0 && <Typography variant="body1" component="p">No joined players</Typography>}
      {playerArray.length > 0 &&
      playerArray.map((value, i) => (
        <ListItem key={i}>
          {value.name}
            <IconButton id={`remove-challenge-btn-${i}`} size="small" color="error" onClick={(e) => handleRemovePlayer(value.name)}>
                <CloseIcon/>
            </IconButton>
          </ListItem>
        ))
      }
    </List>
  );
};

export default RemovePlayer;