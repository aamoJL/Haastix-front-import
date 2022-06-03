import { Modal, Typography, Stack, IconButton, Switch, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: '#191919',
  pl: 2,
  pt: 1,
  pb: 1
};

interface Props {
  open: boolean,
  handleClose: () => void
};
const Settings = (props: Props) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sound, setSound] = useState(false);
  const [theme, setTheme] = useState("theme1");
  const handleDarkMode = () => setDarkMode(!darkMode);
  const handleSound = () => setSound(!sound);

  const handleTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme((event.target as HTMLInputElement).value);
  }
 
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
          <FormControl>
            <FormLabel sx={{color: '#e4e4e4'}}>Theme</FormLabel>
            <RadioGroup row defaultValue="theme1" onChange={handleTheme}>
              <FormControlLabel value="theme1" control={<Radio />} label="Theme1"/>
              <FormControlLabel value="theme2" control={<Radio />} label="Theme2"/>
            </RadioGroup>
          </FormControl>
          <FormControlLabel control={<Switch id="darkmode-switch" checked={darkMode} onChange={handleDarkMode}/>} label="Dark mode"/>
          <FormControlLabel control={<Switch id="volume-switch" checked={sound} onChange={handleSound}/>} label="Sound"/>
        </Stack>
      </Modal>
    </div>
  );
}

export default Settings;