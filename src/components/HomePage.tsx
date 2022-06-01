import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/haastix-green.png';
import SettingsHomeButtons from './SettingsHomeButtons';
import { Stack, Button, Box } from '@mui/material';

function HomePage() {
  return (
    <Box>
      <SettingsHomeButtons isHomePage={true}/>
      <Stack justifyContent="space-evenly" alignItems="center" spacing={3}>
        <Box component="img" src={logo} alt="Logo" sx={{mb:6, width: 0.75, height: 0.75, maxWidth: 824 , maxHeight: 282}}/>
        <Button component={Link} to="/create" variant="contained" id="createChallenge-btn">Create a challenge</Button>
        <Button component={Link} to="/game" variant="contained" id="joinChallenge-btn">Join a challenge</Button>
      </Stack>
    </Box>
  );
}

export default HomePage;