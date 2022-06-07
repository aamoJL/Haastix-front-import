import { Avatar, Button, IconButton, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { PlayerData } from '../interfaces';
import { getEmojiImage } from './storage/Images';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Props{
  socket?: Socket,
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "auto",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

/**
 * Component that renders challenge room's scoreboard sorted by task completion time
 * @param socket Socket.io socket connection
 */
function Scoreboard({socket}: Props) {
  const [scores, setScores] = useState<PlayerData[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | undefined>(undefined);
  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>(undefined);
  const [selectedPhotoNumber, setSelectedPhotoNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);

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

  useEffect(() => {
    if(selectedPlayer){
      fetch(`${process.env.REACT_APP_API_URL}/challenge/fetchfile/${selectedPlayer.playerFileIds[selectedPhotoNumber].fileId}`, {
        method: "GET",
        headers: {
          "Authorization": "bearer " + sessionStorage.getItem("token"),
        }
      })
      .then(async res => {
        let file = await res.blob();
        let reader = new FileReader();
        reader.readAsDataURL(file);
  
        reader.onloadend = () => {
          setSelectedPhoto(reader.result as string);
        }
      })
      .catch(error => console.log(error))
    }
  },[selectedPhotoNumber, selectedPlayer])

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, player: PlayerData) => {
    setSelectedPhotoNumber(0);
    setSelectedPlayer(player);
    setOpenModal(true);
  }

  const handlePhotoArrowClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, photoNumber: number) => {
    // Flip number if over the photo count range
    if(selectedPlayer){
      if(photoNumber < 0){
        photoNumber = selectedPlayer.playerFileIds.length - 1;
      }
      else if(photoNumber >= selectedPlayer.playerFileIds.length){
        photoNumber = 0;
      }
    }
    else{photoNumber = 0;}
    setSelectedPhotoNumber(photoNumber);
  }

  let scoreElements = scores.map((player, i) => {
    return (
      <TableRow id={`scoreboard-row-${i}`} hover key={player.playerName} onClick={(e) => handleRowClick(e, player)}>
        <TableCell><Avatar sx={{ width: 24, height: 24 }} src={getEmojiImage(parseInt(player.playerAvatar))} alt="avatar" /></TableCell>
        <TableCell align='right' id={`scoreboard-name-${i}`}>{player.playerName}</TableCell>
        <TableCell align='right' id={`scoreboard-time-${i}`}>{player.totalTime}</TableCell>
        <TableCell align='right' id={`scoreboard-tasks-${i}`}>{player.playerFileIds.length}</TableCell>
      </TableRow>
    )
  })

  return (
    <Stack direction="column" alignItems="center">
      <Typography id="times-up-title" variant="body1" component="p">Scoreboard</Typography>
      <Button id="open-modal-btn" onClick={() => setOpenModal(true)}>Open modal</Button>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Stack sx={modalStyle} alignItems="center" direction="row">
          <IconButton id="prev-photo-btn" onClick={(e) => handlePhotoArrowClick(e, selectedPhotoNumber - 1)}>
            <ArrowBackIcon />
          </IconButton>
          <Stack direction="column" alignItems="center">
            <img src={selectedPhoto} alt="" />
            <Typography variant="body1" component="p">{`Task number: ${selectedPhotoNumber}`}</Typography>
          </Stack>
          <IconButton id="next-photo-btn" onClick={(e) => handlePhotoArrowClick(e, selectedPhotoNumber + 1)}>
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
      </Modal>
      <TableContainer sx={{maxWidth: 700, maxHeight: 440}}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Icon</TableCell>
              <TableCell align='right'>Name</TableCell>
              <TableCell align='right'>Time</TableCell>
              <TableCell align='right'>Tasks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scoreElements}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default Scoreboard;