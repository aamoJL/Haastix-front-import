import { Avatar, IconButton, Modal, Stack, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { PlayerData } from '../interfaces';
import { getEmojiImage } from './storage/Images';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Props{
  socket?: Socket,
}

const modalStyle : SxProps<Theme> = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "auto",
  bgcolor: 'background.default',
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

const tableHeaderStyle : SxProps<Theme> = {
  backgroundColor: "primary.main", 
  color: "primary.contrastText",
  borderBottomColor: "primary.contrastText"
}

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
  const [modalLoading, setModalLoading] = useState(true);

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
      // Fetch selected photo file
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
          setModalLoading(false);
        }
      })
      .catch(error => console.log(error))
    }
  },[selectedPhotoNumber, selectedPlayer])

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, player: PlayerData) => {
    if(selectedPlayer !== player){
      setModalLoading(true);
      setSelectedPhotoNumber(0);
      setSelectedPlayer(player);
    }
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

  // Scoreboard item rows
  let scoreElements = scores.map((player, i) => {
    return (
      <TableRow id={`scoreboard-row-${i}`} hover key={player.playerName} onClick={(e) => handleRowClick(e, player)}>
        <TableCell>{i + 1}</TableCell>
        <TableCell><Avatar sx={{ width: 24, height: 24 }} src={getEmojiImage(parseInt(player.playerAvatar))} alt="avatar" /></TableCell>
        <TableCell align='left' id={`scoreboard-name-${i}`}>{player.playerName}</TableCell>
        <TableCell align='right' id={`scoreboard-time-${i}`}>{player.totalTime}</TableCell>
        <TableCell align='right' id={`scoreboard-tasks-${i}`}>{player.playerFileIds.length}</TableCell>
      </TableRow>
    )
  })

  return (
    <Stack direction="column" alignItems="center">
      <Typography id="times-up-title" variant="body1" component="p">Scoreboard</Typography>
      <Modal open={openModal && !modalLoading} onClose={() => setOpenModal(false)} disableAutoFocus>
        <Stack sx={modalStyle} alignItems="center" direction="row" spacing={2}>
          <IconButton id="prev-photo-btn" onClick={(e) => handlePhotoArrowClick(e, selectedPhotoNumber - 1)}>
            <ArrowBackIcon />
          </IconButton>
          <Stack direction="column" alignItems="center" spacing={1}>
            <Typography sx={{fontWeight: 'bold'}} variant="body1" component="p">{`${selectedPlayer?.playerName}`}</Typography>
            <img src={selectedPhoto} alt="" />
            <Typography variant="body1" component="p">{`Task number: ${selectedPhotoNumber + 1}`}</Typography>
          </Stack>
          <IconButton id="next-photo-btn" onClick={(e) => handlePhotoArrowClick(e, selectedPhotoNumber + 1)}>
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
      </Modal>
      <TableContainer sx={{maxWidth: 700, maxHeight: 300, width:"auto"}}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyle}>#</TableCell>
              <TableCell sx={tableHeaderStyle}>Icon</TableCell>
              <TableCell sx={tableHeaderStyle} align='left'>Name</TableCell>
              <TableCell sx={tableHeaderStyle} align='right'>Time</TableCell>
              <TableCell sx={tableHeaderStyle} align='right'>Tasks</TableCell>
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