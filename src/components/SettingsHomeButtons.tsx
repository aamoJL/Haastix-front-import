import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { Box, IconButton, Stack } from '@mui/material';
import ExitButton from './ExitButton';

interface Props {
  isHomePage?: boolean;
  isLoggedIn?: boolean
}

function SettingsHomeButtons({isHomePage= false, isLoggedIn= false}: Props) {
  return (
    <Box>
      {!isHomePage && 
        <Stack direction="row" justifyContent="center" alignItems="center">
          <IconButton component={Link} to="/settings" aria-label="settings" id="settings-btn">
            <SettingsIcon fontSize='inherit'/>
          </IconButton>
          <IconButton component={Link} to="/" aria-label="home" id="home-btn">
            <HomeIcon fontSize='inherit'/>
          </IconButton>
          {isLoggedIn && <ExitButton/>}
        </Stack>
      }
      {isHomePage && 
        <Stack direction="row" justifyContent="center" alignItems="flex-start">
        <IconButton component={Link} to="/settings" aria-label="settings" id="settings-btn">
          <SettingsIcon fontSize='inherit'/>
        </IconButton>
        <IconButton component={Link} to="/info" aria-label="info" id="info-btn">
          <InfoIcon fontSize='inherit'/>
        </IconButton>
      </Stack>
      }
    </Box>
  );
}

export default SettingsHomeButtons;