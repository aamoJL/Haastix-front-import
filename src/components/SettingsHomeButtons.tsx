import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { Box, IconButton, Stack } from '@mui/material';

interface Props {
  isHomePage?: boolean;
}

function SettingsHomeButtons({isHomePage= false}: Props) {
  return (
    <Box>
      {!isHomePage && 
        <Stack direction="row" justifyContent="center" alignItems="flex-start">
          <IconButton component={Link} to="/settings" aria-label="settings" id="settings-btn">
            <SettingsIcon fontSize='inherit'/>
          </IconButton>
          <IconButton component={Link} to="/" aria-label="home" id="home-btn">
            <HomeIcon fontSize='inherit'/>
          </IconButton>
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