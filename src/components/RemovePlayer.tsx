import React from 'react';
import CloseIcon from '@mui/icons-material/Close'
import { Button, Collapse, IconButton, List, ListItem, Typography } from '@mui/material';
import { JoinChallengeSuccessResponse, WaitingRoomList} from '../interfaces';
import { Socket } from 'socket.io-client';

interface Props {
  socket?: Socket,
  roomInfo: JoinChallengeSuccessResponse,
  playerArray: WaitingRoomList[],
  open: boolean,
  handleFunction: () => void
}

function RemovePlayer({socket, roomInfo, playerArray, open, handleFunction} : Props) {  

  const handleRemovePlayer = (userName: string) => {
    socket?.emit("removePlayer", {
      token: roomInfo.details.token,
      payload: {
        userName: userName,
      },
    });
  }  
  
  return (
    <div>
      <Button onClick={handleFunction}>Players ({playerArray.length})</Button>
      <Collapse in={open} unmountOnExit>
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
      </Collapse>
    </div>
  );
};

export default RemovePlayer;