import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';

interface Props {
  isHomePage?: boolean;
}

function SettingsHomeButtons({isHomePage= false}: Props) {
  return (
    <div>
      {!isHomePage && 
        <Stack direction="row" justifyContent="center" alignItems="flex-start">
          <IconButton component={Link} to="/settings" aria-label="settings" id="settings-btn">
            <SettingsIcon/>
          </IconButton>
          <IconButton component={Link} to="/" aria-label="home" id="home-btn">
            <HomeIcon/>
          </IconButton>
        </Stack>
      }
      {isHomePage && 
        <Stack direction="row" justifyContent="center" alignItems="flex-start">
        <IconButton component={Link} to="/settings" aria-label="settings" id="settings-btn">
          <SettingsIcon/>
        </IconButton>
        <IconButton component={Link} to="/" aria-label="info" id="info-btn">
          <InfoIcon/>
        </IconButton>
      </Stack>
      }
    </div>
  );
}

export default SettingsHomeButtons;