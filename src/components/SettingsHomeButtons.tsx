import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';

interface Props {
  homePage: boolean;
}

function SettingsHomeButtons(props: Props) {
  return (
    <div>
      {!props.homePage && 
        <Stack direction="row" justifyContent="center" alignItems="flex-start">
          <Link to="settings">
            <IconButton aria-label="settings" id="settings-btn">
              <SettingsIcon/>
            </IconButton>
          </Link>
          <Link to="/">
            <IconButton aria-label="home" id="home-btn">
              <HomeIcon/>
            </IconButton>
          </Link>
        </Stack>
      }
      {props.homePage && 
        <Stack direction="row" justifyContent="center" alignItems="flex-start">
        <Link to="settings">
          <IconButton aria-label="settings" id="settings-btn">
            <SettingsIcon/>
          </IconButton>
        </Link>
        <Link to="about">
          <IconButton aria-label="info" id="info-btn">
            <InfoIcon/>
          </IconButton>
        </Link>
      </Stack>
      }
    </div>
  );
}

export default SettingsHomeButtons;