import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/otsikko-v2.png';
import Button from "@mui/material/Button";
import SettingsHomeButtons from './SettingsHomeButtons';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';

function HomePage() {
  return (
    <div>
      <SettingsHomeButtons isHomePage={true}/>
      <Stack justifyContent="space-evenly" alignItems="center" spacing={2}>
        <Box component="img" src={logo} alt="Logo" sx={{width: 400, height: 200}}/>
        <Button component={Link} to="/create" variant="contained" id="createChallenge-btn">Luo haaste</Button>
        <Button component={Link} to="/game" variant="contained" id="joinChallenge-btn">Liity haasteeseen</Button>
      </Stack>
    </div>
  );
}

export default HomePage;