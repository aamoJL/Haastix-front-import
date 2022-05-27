import { Button, TextField, Typography, Stack, FormControl, InputLabel, Input } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChallengeRoomData, NewChallengeRoomSuccessResponse} from '../interfaces';
import SettingsHomeButtons from './SettingsHomeButtons';

// Form validation variables
// required values from: https://gitlab.labranet.jamk.fi/wimmalab2021/iotitude/source-backend/-/blob/master/documents/restApiRoutesDocuments/newChallenge.md
const formValidation = {
  minTaskCount: 1,
  maxTaskCount: 20,
  minNameLength: 3,
  maxNameLength: 30,
  minTaskDescription: 3,
  maxTaskDescription: 256,
  minDuration: 1,
  maxDuration: 240,
  minDelay: 0,
  maxDelay: 60,
}

/**
 * Initial form values
 */
const defaultFormData : ChallengeRoomData = {
  roomName: "",
  challenges: [{description: "", challengeNumber: 0}],
  time: formValidation.minDuration,
  delay: formValidation.minDelay,
}

function CreateChallengeRoom() {
  const [formData, setFormData] = useState<ChallengeRoomData>(defaultFormData);
  const {roomName, challenges, delay, time} = formData;
  const navigate = useNavigate();

  /**
   * Generic change handler
   * @param e 
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  const handleChallengeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
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
    let newList = challenges;    

    if(newList.length < formValidation.maxTaskCount){
      newList = challenges.concat([{description: "", challengeNumber: 0}]);
    }

    setFormData((prevState) => ({
      ...prevState,
      challenges: newList,
    }));
  }

  const handleRemoveChallenge = (i: number) => {
    let newList = challenges;
    newList.splice(i, 1);

    // Add empty challenge if all challenges has been removed
    // (Submit requires minimum of one challenge)
    if(newList.length < formValidation.minTaskCount){
      newList = [{description: "", challengeNumber: 0}];
    }

    setFormData((prevState) => ({
      ...prevState,
      challenges: newList,
    }));
  }

  /**
   * Generic numeral input change handler with value clamping
   * @param e event
   * @param min input's min value
   * @param max input's max value
   */
  const handleNumInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, min?: number, max?: number) => {
    let newValue = Number(e.target.value);
    
    // Clamp value
    newValue = (min !== undefined && newValue < min) ? min : newValue;
    newValue = (max !== undefined && newValue > max) ? max : newValue;

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: newValue,
    }));
  }

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    let error = false;

    // Data validation
    if(roomName.length > formValidation.maxNameLength){alert(`Room name can't be over ${formValidation.maxNameLength} characters long!`); error = true;}
    if(roomName.length < formValidation.minNameLength){alert(`Room name must be at least ${formValidation.minNameLength} characters long!`); error = true;}
    if(delay > formValidation.maxDelay){alert(`Delay can't be over ${formValidation.maxDelay} seconds long!`); error = true;}
    if(delay < formValidation.minDelay){alert(`Delay must be at least ${formValidation.minDelay} seconds long!`); error = true;}
    if(time > formValidation.maxDuration){alert(`Duration can't be over ${formValidation.maxDuration} seconds long!`); error = true;}
    if(time < formValidation.minDuration){alert(`Duration must be at least ${formValidation.minDuration} seconds long!`); error = true;}
    if(challenges.length > formValidation.maxTaskCount){alert(`The room can't have more than ${formValidation.maxTaskCount} tasks!`); error = true;}
    if(challenges.length < formValidation.minTaskCount){alert(`The room needs at least ${formValidation.minTaskCount} tasks!`); error = true;}

    challenges.every((challenge, i) => {
      if(challenge.description.length > formValidation.maxTaskDescription){alert(`Task description can't be more than ${formValidation.maxTaskDescription} characters long!`); error = true;}
      if(challenge.description.length < formValidation.minTaskDescription){alert(`Task description must be at least ${formValidation.minTaskDescription} characters long!`); error = true;}
      if(error){return false;}
      // Set challenge numbers
      challenge.challengeNumber = i;
      return true;
    });

    if(error){return;}

    let json = JSON.stringify({
      challengeName: roomName,
      challengeDuration: time,
      challengeStartDelay: delay,
      challengeTasks: challenges,
    });

    // Send data to API
    fetch(
      `${process.env.REACT_APP_API_URL}/challenge/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: json
      }
    )
      .then(res => res.json())
      .then(res => {
        if (res.statusCode === 200) {
          onSuccess(res);
        } else {
          throw Error(res.message);
        }
      })
      .catch(error => alert(error));
  }

  const onSuccess = (response: NewChallengeRoomSuccessResponse) => {
    // save token
    console.log(response);
    sessionStorage.setItem("token", response.details.token);
    navigate("/game");
  }

  return (
    <div>
      <SettingsHomeButtons />
      <Typography variant="h2" component="h2">Otsikko</Typography>
      <TextField type="text" name="roomName" id="roomName" value={roomName} onChange={onChange} placeholder="Type room name..." inputProps={{ maxLength: formValidation.maxNameLength }}/>
      <Typography variant="h3" component="h2">Haaste</Typography>
      {
        challenges.map((challenge, i) => (
          <div key={i}>
              <TextField multiline variant="standard" type="text" value={challenge.description} onChange={(e) => handleChallengeChange(e, i)} inputProps={{ maxLength: formValidation.maxTaskDescription }} placeholder="Kuvaus..."/>
              <Button size="small" color="error" onClick={(e) => handleRemoveChallenge(i)}>X</Button>
          </div>
        ))
      }
      <Button sx={{m: 1}} variant='outlined' size="medium" onClick={(e) => {handleAddChallenge()}}>Lisää haasteita</Button>
      <Typography variant="h3" component="h2">Aloitus & kesto</Typography>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <FormControl variant="standard">
          <InputLabel htmlFor="delay">Viive</InputLabel>
          <Input type='number' name="delay" id="delay" value={delay} onChange={(e) => handleNumInputChange(e, formValidation.minDelay, formValidation.maxDelay)}/>
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="time">Kesto</InputLabel>
          <Input type="number" name="time" id="time" value={time} onChange={(e) => handleNumInputChange(e, formValidation.minDuration, formValidation.maxDuration)}/>
        </FormControl>
      </Stack>
      <div>
        <Button sx={{m: 1}} variant='contained' size="large" onClick={(e) => onSubmit(e)}>Luo haaste</Button>
      </div>
    </div>
  );
}

export default CreateChallengeRoom;