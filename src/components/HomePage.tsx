import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/otsikko-v2.png';
import SettingsHomeButtons from './SettingsHomeButtons';
import { Stack, Button, Box } from '@mui/material';

function HomePage() {
  return (
    <Box>
      <SettingsHomeButtons isHomePage={true}/>
      <Stack justifyContent="space-evenly" alignItems="center" spacing={2}>
        <Box component="img" src={logo} alt="Logo" sx={{width: 400, height: 200}}/>
        <Button component={Link} to="/create" variant="contained" id="createChallenge-btn">Create a challenge</Button>
        <Button component={Link} to="/game" variant="contained" id="joinChallenge-btn">Join a challenge</Button>
      </Stack>
    </Box>
  );
}

export default HomePage;