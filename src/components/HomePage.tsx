import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/otsikko-v2.png';
import Button from "@mui/material/Button";

function HomePage() {
  return (
    <div>
      <div>
        <Link to="about" id="about-link">
          <Button id="info-btn">Info</Button>
        </Link>
        <Link to="settings" id="settings-link">
          <Button id="settings-btn">Settings</Button>
        </Link>
      </div>
      <img src={logo} alt="Logo" />
      <Link to="create" id="createChallenge-link">
        <Button variant="contained" id="createChallenge-btn">Luo haaste</Button>
      </Link>
      <Link to="game" id="joinChallenge-link">
        <Button variant="contained" id="joinChallenge-btn">Liity haasteeseen</Button>
      </Link>
    </div>
  );
}

export default HomePage;