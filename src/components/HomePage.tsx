import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/otsikko-v2.png';

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
        <button id="createChallenge-btn">Luo haaste</button>
      </Link>
      <Link to="join">
        <button id="joinChallenge-btn">Liity haasteeseen</button>
      </Link>
    </div>
  );
}

export default HomePage;