import { Button, TextField, Typography, Stack, FormControl, InputLabel, Input, Box, IconButton, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChallengeRoomData, NewChallengeRoomSuccessResponse} from '../interfaces';
import SettingsHomeButtons from './SettingsHomeButtons';
import { Translation } from '../translations';

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

interface Props{
  translation: Translation
}

function CreateChallengeRoom({translation}: Props) {
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
    if(roomName.length > formValidation.maxNameLength){alert(translation.errors.nameLength); error = true;}
    if(roomName.length < formValidation.minNameLength){alert(translation.errors.nameLength); error = true;}
    if(delay && delay > formValidation.maxDelay){alert(translation.errors.delayAmount); error = true;}
    if(delay && delay < formValidation.minDelay){alert(translation.errors.delayAmount); error = true;}
    if(time > formValidation.maxDuration){alert(translation.errors.durationAmount); error = true;}
    if(time < formValidation.minDuration){alert(translation.errors.durationAmount); error = true;}
    if(challenges.length > formValidation.maxTaskCount){alert(translation.errors.taskCount); error = true;}
    if(challenges.length < formValidation.minTaskCount){alert(translation.errors.taskCount); error = true;}

    challenges.every((challenge, i) => {
      if(challenge.description.length > formValidation.maxTaskDescription){alert(translation.errors.taskDescriptionLength); error = true;}
      if(challenge.description.length < formValidation.minTaskDescription){alert(translation.errors.taskDescriptionLength); error = true;}
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
    <Stack alignItems='center' justifyContent="center" spacing={1}>
      <SettingsHomeButtons/>
      <Typography variant="h3" component="h3">{translation.titles.createGame}</Typography>
      <TextField type="text" name="roomName" id="roomName" value={roomName} onChange={onChange} label={translation.inputs.texts.roomName}  inputProps={{ maxLength: formValidation.maxNameLength }}/>
      <Typography variant="h4" component="h4">{translation.titles.challenges}</Typography>
      <Box sx={{maxHeight: 205, overflow: 'auto', maxWidth: 200}}>
      {
        challenges.map((challenge, i) => (
          <TextField
            autoFocus
            key={i} 
            id={`challenge-input-${i}`} 
            size="small"
            sx={{mb:1}}
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
            placeholder={`${translation.inputs.texts.description}...`}
            />
        ))
      }
      </Box>
      <Button sx={{m: 1}} id="add-challenge-btn" variant='text' size="medium" onClick={(e) => {handleAddChallenge()}}>{translation.inputs.buttons.addNewChallenge}</Button>
        <FormControl variant="standard">
          <InputLabel htmlFor="delay">{translation.inputs.texts.delayBeforeGameStarts}</InputLabel>
          <Input
            onClick={handleNumberInputClick}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            name="delay"
            id="delay"
            value={delay}
            onChange={(e) => handleNumInputChange(e, formValidation.maxDelay)}
            endAdornment= {
              <InputAdornment position="end">
                Min
              </InputAdornment>
            }
            />
        </FormControl>
        <FormControl variant="standard">
          <InputLabel htmlFor="time">{translation.inputs.texts.gameDuration}</InputLabel>
          <Input
            onClick={handleNumberInputClick}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            name="time"
            id="time"
            value={time}
            onChange={(e) => handleNumInputChange(e, formValidation.maxDuration)}
            endAdornment= {
              <InputAdornment position="end">
                Min
              </InputAdornment>
            }
            />
        </FormControl>
      <Box>
        <Button id="create-game-btn" sx={{mt: 1}} variant='contained' size="large" onClick={(e) => onSubmit(e)}>{translation.inputs.buttons.createGame}</Button>
      </Box>
    </Stack>
  );
}

export default CreateChallengeRoom;