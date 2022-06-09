import React from 'react';
import CloseIcon from '@mui/icons-material/Close'
import { Collapse, IconButton, List, ListItem, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from '@mui/material';
import { JoinChallengeSuccessResponse, WaitingRoomList} from '../interfaces';
import { Socket } from 'socket.io-client';

interface Props {
  socket?: Socket,
  roomInfo: JoinChallengeSuccessResponse,
  playerArray: WaitingRoomList[],
  open: boolean,
}

const tableHeaderStyle : SxProps<Theme> = {
  backgroundColor: "primary.main", 
  color: "primary.contrastText",
  borderBottomColor: "primary.contrastText"
}

function RemovePlayer({socket, roomInfo, playerArray, open} : Props) {  

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
      <Collapse in={open} unmountOnExit>
        <TableContainer sx={{maxWidth: 300, overflow: 'hidden'}}>
          <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>#</TableCell>
              <TableCell sx={tableHeaderStyle}>Name</TableCell>
              <TableCell sx={tableHeaderStyle}></TableCell>
            </TableRow>
          </TableHead>
          {playerArray.length === 0 && <Typography variant="body1" component="p">No joined players</Typography>}
          {playerArray.length > 0 &&
          <TableBody>
            {playerArray.map((value, i) => (
            <TableRow key={i}>
              <TableCell>
                {i + 1}
              </TableCell>
              <TableCell>
                {value.name}
              </TableCell>
              <TableCell>
                <IconButton id={`remove-challenge-btn-${i}`} size="small" color="error" onClick={(e) => handleRemovePlayer(value.name)}>
                    <CloseIcon/>
                </IconButton>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
          }
          </Table>
        </TableContainer>
      </Collapse>
    </div>
  );
};

export default RemovePlayer;