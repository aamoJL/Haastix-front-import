import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/otsikko-v2.png';
import Button from "@mui/material/Button";

function HomePage() {
  return (
    <div>
      <div>
        <Link to="about">
          <button id="info-btn">Info</button>
        </Link>
        <Link to="settings">
          <button id="settings-btn">Settings</button>
        </Link>
      </div>
      <img src={logo} alt="Logo" />
      <Link to="create">
        <Button variant="contained" id="createChallenge-btn">Luo haaste</Button>
      </Link>
      <Link to="join">
        <Button variant="contained" id="joinChallenge-btn">Liity haasteeseen</Button>
      </Link>
    </div>
  );
}

export default HomePage;