import React, { useState } from 'react';
import { ChallengeRoomData } from '../interfaces';
import SettingsHomeButtons from './SettingsHomeButtons';

const defaultFormData : ChallengeRoomData = {
  roomName: "",
  challenges: [{description: ""}],
  time: undefined,
  delay: undefined,
}

function CreateChallengeRoom() {
  const [formData, setFormData] = useState<ChallengeRoomData>(defaultFormData);
  const {roomName, challenges, delay, time} = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const handleChallengeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newChallenges = challenges.map((challenge, i) => {
      if(index !== i) return challenge;
      return {...challenge, description: e.target.value};
    })

    setFormData((prevState) => ({
      ...prevState,
      challenges: newChallenges,
    }));
  }

  const handleAddChallenge = () => {
    setFormData((prevState) => ({
      ...prevState,
      challenges: challenges.concat([{description: ""}]),
    }));
  }

  const handleRemoveChallenge = (i: number) => {
    let newList = challenges;
    newList.splice(i, 1)

    setFormData((prevState) => ({
      ...prevState,
      challenges: newList,
    }));
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Submit WIP
  }

  return (
    <div>
      <SettingsHomeButtons />
      <form id="challenge-form" onSubmit={onSubmit}>
        <label htmlFor="roomName">Otsikko</label>
        <br />
        <input type="text" name="roomName" id="roomName" value={roomName} onChange={onChange}/>
        <br />
        <label htmlFor="challengeDescription">Haaste</label>
        <br />
        {
          challenges.map((challenge, i) => (
            <div key={i}>
              <input type="text" value={challenge.description} onChange={(e) => handleChallengeChange(e,i)}/>
              <button onClick={(e) => handleRemoveChallenge(i)}>X</button>
            </div>
          ))
        }
        <button onClick={(e) => {handleAddChallenge()}}>Lisää haasteita</button>
        <br />
        <label htmlFor="delay">Aloitus & Kesto</label>
        <br />
        <input type="number" name="delay" id="delay" value={delay} placeholder="Viive" onChange={onChange}/>
        <input type="number" name="time" id="time" value={time} placeholder="Kesto" onChange={onChange}/>
        <br />
        <button>Luo haaste</button>
      </form>
    </div>
  );
}

export default CreateChallengeRoom;