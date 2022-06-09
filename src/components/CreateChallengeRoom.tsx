import { Button, TextField, Typography, Stack, FormControl, InputLabel, Input, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useState } from 'react';
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
  time: 0,
  delay: 0,
}

function CreateChallengeRoom() {
  const [formData, setFormData] = useState<ChallengeRoomData>(defaultFormData);
  const {roomName, challenges, delay, time} = formData;
  const navigate = useNavigate();

  useEffect(() => {
    if(sessionStorage.getItem('token') !== null)
      navigate("/game");
  })

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
  const handleNumInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, max?: number) => {
    let newValue = Number(e.target.value);
    // The new value will be NaN if the value does not match the input pattern validation
    // Don't do anything if the new value is NaN
    if(isNaN(newValue)){return;}

    // Clamp value
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
    if(delay && delay > formValidation.maxDelay){alert(`Delay can't be over ${formValidation.maxDelay} minutes long!`); error = true;}
    if(delay && delay < formValidation.minDelay){alert(`Delay must be at least ${formValidation.minDelay} minutes long!`); error = true;}
    if(time > formValidation.maxDuration){alert(`Duration can't be over ${formValidation.maxDuration} minutes long!`); error = true;}
    if(time < formValidation.minDuration){alert(`Duration must be at least ${formValidation.minDuration} minutes long!`); error = true;}
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

  /**
   * Number input click handler will be used to select the input's text on click
   * @param e event
   */
  const handleNumberInputClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let element = e.target as HTMLInputElement;
    (document.getElementById(element.id) as HTMLInputElement)?.select();
  }

  return (
    <Stack alignItems='center' spacing={1}>
      <SettingsHomeButtons/>
      <Typography variant="h3" component="h3">Create game</Typography>
      <TextField type="text" name="roomName" id="roomName" value={roomName} onChange={onChange} label="Room name"  inputProps={{ maxLength: formValidation.maxNameLength }}/>
      <Typography variant="h4" component="h4">Challenges</Typography>
      {
        challenges.map((challenge, i) => (
          <Box sx={{maxHeight: '50%'}} key={i}>
              <TextField 
                id={`challenge-input-${i}`} 
                size="small" 
                multiline 
                type="text" 
                value={challenge.description} 
                onChange={(e) => handleChallengeChange(e, i)} 
                inputProps={{ maxLength: formValidation.maxTaskDescription }} 
                InputProps={{
                  endAdornment: (
                    <IconButton id={`remove-challenge-btn-${i}`} size="small" color="error" onClick={(e) => handleRemoveChallenge(i)}>
                    <CloseIcon/>
                  </IconButton>
                  )
                }}
                placeholder="Description..."
                />
          </Box>
        ))
      }
      <Button sx={{m: 1}} id="add-challenge-btn" variant='text' size="medium" onClick={(e) => {handleAddChallenge()}}>Add new challenge</Button>
        <FormControl variant="standard">
          <InputLabel htmlFor="delay">Delay before game starts</InputLabel>
          <Input onClick={handleNumberInputClick} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name="delay" id="delay" value={delay} onChange={(e) => handleNumInputChange(e, formValidation.maxDelay)}/>
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="time">Game duration</InputLabel>
          <Input onClick={handleNumberInputClick} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} name="time" id="time" value={time} onChange={(e) => handleNumInputChange(e, formValidation.maxDuration)}/>
        </FormControl>
      <Box>
        <Button sx={{m: 1}} variant='contained' size="large" onClick={(e) => onSubmit(e)}>Create game</Button>
      </Box>
    </Stack>
  );
}

export default CreateChallengeRoom;