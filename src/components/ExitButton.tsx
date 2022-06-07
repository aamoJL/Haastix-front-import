import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isGameEnded?: boolean
}

const ExitButton = ({isGameEnded= false}: Props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  const exitChallengeRoom = () => {
    fetch(`${process.env.REACT_APP_API_URL}/challenge/exit`,
    {
      method:"GET",
        headers: {
          Authorization: `bearer ${sessionStorage.getItem('token')}`,
        }
    }).catch((error) => {
      console.log(error);
    })
    sessionStorage.removeItem('token');
    navigate("/");
  };

  return (
    <div>
      {isGameEnded && <Button variant="contained" id="exit-btn" onClick={exitChallengeRoom}>Exit</Button>}
      {!isGameEnded && <Button variant="contained" id="exit-btn" onClick={handleOpen}>Exit</Button>}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle alignSelf="center" >Do you want to exit</DialogTitle>
        <DialogActions>
            <Button sx={{width: 20}} id="confirm-exit-btn" onClick={exitChallengeRoom}>Yes</Button>
            <div style={{flex: '1 0 0'}}/>
            <Button sx={{width: 20}} id="close-exit-btn" onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExitButton;