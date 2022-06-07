import React from 'react';
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material';
import { JoinChallengeSuccessResponse, WaitingRoomList, WaitingRoomNewPlayer} from '../interfaces';
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
    <div>
    {playerArray.length > 0 &&
    playerArray.map((value, i) => (
      <div key={i}>
        {value.name}
          <IconButton id={`remove-challenge-btn-${value.name}`} size="small" color="error" onClick={(e) => handleRemovePlayer(value.name)}>
              <CloseIcon/>
          </IconButton>
        </div>
      ))
    }
    </div>
  );
};

export default RemovePlayer;