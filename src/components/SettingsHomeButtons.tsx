import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { Box, IconButton, Stack } from '@mui/material';
import { useState } from 'react';
import Settings from './Settings';

interface Props {
  isHomePage?: boolean;
}

function SettingsHomeButtons({isHomePage= false}: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  return (
    <div>
      {!isHomePage && 
        <Stack direction="row" justifyContent="center" alignItems="flex-start">
          <IconButton aria-label="settings" id="settings-btn" onClick={handleOpen}>
            <SettingsIcon fontSize='inherit'/>
          </IconButton>
          <IconButton component={Link} to="/" aria-label="home" id="home-btn">
            <HomeIcon fontSize='inherit'/>
          </IconButton>
        </Stack>
      }
      {isHomePage && 
        <Stack direction="row" justifyContent="center" alignItems="flex-start">
        <IconButton aria-label="settings" id="settings-btn" onClick={handleOpen}>
          <SettingsIcon fontSize='inherit'/>
        </IconButton>
        <IconButton component={Link} to="/info" aria-label="info" id="info-btn">
          <InfoIcon fontSize='inherit'/>
        </IconButton>
      </Stack>
      }
      <Settings open={open} handleClose={handleClose}/>
    </div>
  );
}

export default SettingsHomeButtons;