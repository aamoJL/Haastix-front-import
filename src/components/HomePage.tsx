import React from 'react';
import logo from '../assets/otsikko-v2.png';
import Button from "@mui/material/Button";

function HomePage() {
  return (
    <div>
      <div>
        {/*click => Info */}
        <button id="info-btn">Info</button>
        {/*click => Settings */}
        <button id="settings-btn">Settings</button>
      </div>
      <img src={logo} alt="Logo" />
      {/*click => CreateChallenge */}
      <br></br>
      <Button variant="contained" id="createChallenge-btn">Luo haaste</Button>
      {/*click => JoinChallenge */}
      <Button variant="contained" id="joinChallenge-btn">Liity haasteeseen</Button>
    </div>
  );
}

export default HomePage;