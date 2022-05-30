import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  homePage: boolean;
}

function SettingsHomeButtons(props: Props) {
  return (
    <div>
      {!props.homePage && 
        <Stack direction="row" justifyContent="space-evenly" >
          <Link to="settings">
            <Button variant="contained" id="settings-btn">Settings</Button>
          </Link>
          <Link to="/">
            <Button variant="contained" id="home-btn">Home</Button>
          </Link>
        </Stack>
      }
      {props.homePage && 
        <Stack direction="row" justifyContent="space-between" >
        <Link to="settings">
          <Button variant="contained" id="settings-btn">Settings</Button>
        </Link>
        <Link to="about">
          <Button variant="contained" id="info-btn">Info</Button>
        </Link>
      </Stack>
      }
    </div>
  );
}

export default SettingsHomeButtons;