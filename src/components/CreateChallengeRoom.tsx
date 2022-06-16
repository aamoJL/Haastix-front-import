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
  const [roomNameError, setRoomNameError] = useState(false);
  const [delayAmountError, setDelayAmountError] = useState(false);
  const [durationAmountError, setDurationAmountError] = useState(false);
  const [taskErrors, setTaskErrors] = useState<boolean[]>([false]);
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if(sessionStorage.getItem('token') !== null)
      navigate("/game");
  })

  useEffect(() => {
    // Form validation for the form submit button
    setFormIsValid(roomName.length <= formValidation.maxNameLength
      && roomName.length >= formValidation.minNameLength
      && delay <= formValidation.maxDelay
      && delay >= formValidation.minDelay
      && time <= formValidation.maxDuration
      && time >= formValidation.minDuration
      && challenges.length <= formValidation.maxTaskCount
      && challenges.length >= formValidation.minTaskCount)
  }, [roomName, challenges, delay, time])

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

    //If error is shown, remove it if the length is right
    let task = newChallenges[index];
    if(taskErrors[index] && task.description.length >= formValidation.minTaskDescription
      && task.description.length <= formValidation.maxTaskDescription){
        let newErrorArray = taskErrors;
        newErrorArray[index] = false;
        setTaskErrors([...newErrorArray]);
      }

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

    // Update task error list
    let taskErrorArray = [...taskErrors, false];
    setTaskErrors([...taskErrorArray]);
  }

  const handleRemoveChallenge = (i: number) => {
    let newList = challenges;
    newList.splice(i, 1);
    
    let newErrorArray = taskErrors;
    newErrorArray.splice(i,1);

    // Fill the arrays to be lenght of minimum requirements
    if(newList.length < formValidation.minTaskCount){
      for (let index = 0; index < formValidation.minTaskCount; index++) {
        newList.push({description: "", challengeNumber: 0});
        newErrorArray.push(false);
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      challenges: newList,
    }));

    // Update taks error list
    setTaskErrors([...newErrorArray]);
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
    let newTaskErrorArray = taskErrors;

    // Data validation
    if(roomName.length > formValidation.maxNameLength){setRoomNameError(true); error = true;}
    if(roomName.length < formValidation.minNameLength){setRoomNameError(true); error = true;}
    if(delay > formValidation.maxDelay){setDelayAmountError(true); error = true;}
    if(delay < formValidation.minDelay){setDelayAmountError(true); error = true;}
    if(time > formValidation.maxDuration){setDurationAmountError(true); error = true;}
    if(time < formValidation.minDuration){setDurationAmountError(true); error = true;}
    if(challenges.length > formValidation.maxTaskCount){ error = true;}
    if(challenges.length < formValidation.minTaskCount){ error = true;}

    // task length validations
    challenges.every((challenge, i) => {
      if(challenge.description.length > formValidation.maxTaskDescription 
        || challenge.description.length < formValidation.minTaskDescription){
          error = true;
        }

      newTaskErrorArray[i] = error;

      if(error){return false;}
      // Set challenge numbers
      challenge.challengeNumber = i;
      return true;
    });

    setTaskErrors((prev) => ({
      ...prev,
      newTaskErrorArray
    }));

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

  const handleRoomNameBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    // Validation
    setRoomNameError((roomName.length > formValidation.maxNameLength 
      || roomName.length < formValidation.minNameLength));
  }

  const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //If error is shown, remove it if the length is right
    if(roomNameError && e.target.value.length >= formValidation.minNameLength
      && e.target.value.length <= formValidation.maxNameLength){setRoomNameError(false);}
    
    onChange(e);
  }

  const handleChallengeDescBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>, i: number) => {
    // validation
    let task = challenges[i];
    let newErrorArray = taskErrors;
    newErrorArray[i] = (task.description.length > formValidation.maxTaskDescription 
      || task.description.length < formValidation.minTaskDescription);

    setTaskErrors([...newErrorArray]);
  }

  const handleDurationBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    // Validation
    setDurationAmountError(time > formValidation.maxDuration || time < formValidation.minDuration);
  }

  const handleDelayBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    // Validation
    setDelayAmountError(delay > formValidation.maxDelay || delay < formValidation.minDelay);
  }

  return (
    <Stack alignItems='center' justifyContent="center" spacing={1}>
      <SettingsHomeButtons/>
      <Typography variant="h3" component="h3">{translation.titles.createGame}</Typography>
      <TextField
        autoFocus
        helperText={translation.inputs.texts.roomNameLengthHelper}
        error={roomNameError}
        type="text"
        name="roomName"
        id="roomName"
        value={roomName}
        onChange={handleRoomNameChange}
        onBlur={handleRoomNameBlur}
        label={translation.inputs.texts.roomName}
        inputProps={{ maxLength: formValidation.maxNameLength }}/>
      <Typography variant="h4" component="h4">{translation.titles.challenges}</Typography>
      <Typography fontSize="small">{translation.inputs.texts.taskDescriptionLengthHelper}</Typography>
      <Typography fontSize="small">{translation.inputs.texts.taskCountHelper}</Typography>
      <Box sx={{maxHeight: 205, overflow: 'auto', maxWidth: 200}}>
      {
        challenges.map((challenge, i) => (
          <TextField
            autoFocus={i > 0}
            error={taskErrors[i]}
            key={i} 
            id={`challenge-input-${i}`} 
            size="small"
            sx={{mb:1}}
            multiline 
            type="text" 
            value={challenge.description} 
            onChange={(e) => handleChallengeChange(e, i)}
            onBlur={((e) => handleChallengeDescBlur(e,i))}
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
            onClick={(e)=>{handleNumberInputClick(e); setDelayAmountError(false);}}
            error={delayAmountError}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            name="delay"
            id="delay"
            value={delay}
            onChange={(e) => handleNumInputChange(e, formValidation.maxDelay)}
            onBlur={(e)=>handleDelayBlur(e)}
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
            onClick={(e)=>{handleNumberInputClick(e); setDurationAmountError(false);}}
            error={durationAmountError}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            name="time"
            id="time"
            value={time}
            onChange={(e) => handleNumInputChange(e, formValidation.maxDuration)}
            onBlur={(e)=>handleDurationBlur(e)}
            endAdornment= {
              <InputAdornment position="end">
                Min
              </InputAdornment>
            }
            />
        </FormControl>
      <Box>
        <Button disabled={!formIsValid} id="create-game-btn" sx={{mt: 1}} variant='contained' size="large" onClick={(e) => onSubmit(e)}>{translation.inputs.buttons.createGame}</Button>
      </Box>
    </Stack>
  );
}

export default CreateChallengeRoom;