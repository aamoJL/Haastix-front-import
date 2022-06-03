import { Modal, Typography, Stack, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  pl: 2,
  pt: 1
};

interface Props {
  open: boolean,
  handleClose: () => void
};
const Settings = (props: Props) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(false);
  const handleDarkMode = () => setDarkMode(!darkMode);
  const handleSound = () => setSound(!sound);
 
  return (
    <div>
      <Modal open={props.open} onClose={props.handleClose}>
        <Stack sx={style} >
          <Stack direction="row-reverse" justifyContent="space-between">
            <IconButton onClick={props.handleClose}>
              <CloseIcon/>
            </IconButton>
            <Typography variant="h5">
              Settings
            </Typography>
          </Stack>
          <FormControlLabel control={<Switch checked={darkMode} onChange={handleDarkMode}/>} label="Dark mode"/>
          <FormControlLabel control={<Switch checked={sound} onChange={handleSound}/>} label="Sound"/>
        </Stack>
      </Modal>
    </div>
  );
}

export default Settings;