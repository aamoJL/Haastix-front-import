import React from 'react';
import logo from '../assets/otsikko-v2.png';

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
      <button id="createChallenge-btn">Luo haaste</button>
      {/*click => JoinChallenge */}
      <button id="joinChallenge-btn">Liity haasteeseen</button>
    </div>
  );
}

export default HomePage;