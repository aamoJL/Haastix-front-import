import React, { useState } from 'react';
import { ChallengeRoomData } from '../interfaces';
import groupIcon from '../assets/icons/groups_black_24dp.png';
import SettingsHomeButtons from './SettingsHomeButtons';

interface Props{
  roomCode: string,
  roomData: ChallengeRoomData,
}

function WaitingRoomViewGamemaster(props : Props) {
  const [time, setTime] = useState(1);
  const [roomPlayers, setRoomPlayers] = useState([]);


  return (
    <div>
      <SettingsHomeButtons/>
      <div>
        <h1>{props.roomData.roomName}</h1>
        <p>{props.roomCode}</p>
        <p>{props.roomData.challenges[0].description}</p>
        <p>{`Haasteen alkuun ${time}`}</p>
        <p>Pelaajia liittynyt</p>
        <div><img src={groupIcon} alt='group icon' />{roomPlayers.length}</div>
        {/*click => Room Edit Modal(?) */}
        <button id="editChallenge-btn">Muokkaa haastetta</button>
      </div>
    </div>
  );
}

export default WaitingRoomViewGamemaster;