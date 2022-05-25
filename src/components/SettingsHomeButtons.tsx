import React from 'react';
import { Link } from 'react-router-dom';

function SettingsHomeButtons() {
  return (
    <div>
      <Link to="settings">
        <button id="settings-btn">Settings</button>
      </Link>
      <Link to="/">
        <button id="home-btn">Home</button>
      </Link>
      </div>
  );
}

export default SettingsHomeButtons;