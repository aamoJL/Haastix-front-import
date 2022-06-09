import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { Box, IconButton, Stack } from '@mui/material';
import ExitButton from './ExitButton';
import Settings from './Settings';
import { useState } from 'react';

interface Props {
  isHomePage?: boolean;
  isLoggedIn?: boolean
}

function SettingsHomeButtons({isHomePage= false, isLoggedIn= false}: Props) {
  const [open, setOpen] = useState(false); // if true open settings page
  const handleChange = () => setOpen(!open);

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <IconButton aria-label="settings" id="settings-btn" onClick={handleChange}>
        <SettingsIcon fontSize='inherit'/>
      </IconButton>
      {!isHomePage && 
          <IconButton component={Link} to="/" aria-label="home" id="home-btn">
            <HomeIcon fontSize='inherit'/>
          </IconButton>
      }
      {isHomePage && 
        <IconButton component={Link} to="/info" aria-label="info" id="info-btn">
          <InfoIcon fontSize='inherit'/>
        </IconButton>
      }
      {isLoggedIn && <ExitButton/>}
      <Settings open={open} handleClose={handleChange}/>
    </Stack>
  );
}

export default SettingsHomeButtons;
