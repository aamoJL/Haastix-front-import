import React from 'react';
import { Link } from 'react-router-dom';
import banner from '../assets/banner.svg';
import SettingsHomeButtons from './SettingsHomeButtons';
import { Stack, Button, Box } from '@mui/material';

function HomePage() {
  return (
    <Stack justifyContent="space-evenly" alignItems="center" spacing={3}>
      <SettingsHomeButtons isHomePage={true}/>
      <Box component="img" src={banner} alt="Logo" sx={{mb:6, width: 0.75, height: 0.75, maxWidth: 824 , maxHeight: 282}}/>
      <Button component={Link} to="/create" variant="contained" id="createChallenge-btn">Create a challenge</Button>
      <Button component={Link} to="/game" variant="contained" id="joinChallenge-btn">Join a challenge</Button>
    </Stack>
  );
}

export default HomePage;