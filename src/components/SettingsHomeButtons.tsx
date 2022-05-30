import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

function SettingsHomeButtons() {
  return (
    <div>
      <Link to="settings" id="settings-link">
        <Button id="settings-btn">Settings</Button>
      </Link>
      <Link to="/" id="home-link">
        <Button id="home-btn">Home</Button>
      </Link>
    </div>
  );
}

export default SettingsHomeButtons;