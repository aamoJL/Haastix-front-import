import { Modal, Typography, Stack, IconButton, Switch, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from 'react';
import { getTranslation, Language } from '../Translation';

const style = {
  position: 'absolute' as 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: '#191919',
  pl: 2,
  pt: 1,
  pb: 1
};

interface Props {
  open: boolean,
  handleClose: () => void
};
const Settings = (props: Props) => {
  const [darkMode, setDarkMode] = useState(false); //switch between dark and light mode TODO callback for this state
  const [sound, setSound] = useState(false); //toggle sound
  const [language, setLanguge] = useState<Language>(localStorage.getItem("language") === null ? "en" : localStorage.getItem("language") as Language); //toggle language
  const [theme, setTheme] = useState("theme1"); //set what theme to use 
  const handleDarkMode = () => setDarkMode(!darkMode);
  const handleSound = () => setSound(!sound);

  const handleTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme((event.target as HTMLInputElement).value);
  }

  /**
   * Event handler for language switch, sets localstorage languge value to selected language
   */
  const handleLanguage = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    let lang : Language = checked ? "en" : "fi";
    setLanguge(lang);
    localStorage.setItem("language", lang);
    document.dispatchEvent(new Event("language-change"));
  }
 
  return (
    <div>
      <Modal open={props.open} onClose={props.handleClose}>
        <Stack sx={style} >
          <Stack direction="row-reverse" justifyContent="space-between">
            <IconButton onClick={props.handleClose}>
              <CloseIcon/>
            </IconButton>
            <Typography variant="h5">
              {getTranslation(language, "Settings")}
            </Typography>
          </Stack>
          <FormControl>
            <FormLabel sx={{color: '#e4e4e4'}}>Theme</FormLabel>
            <RadioGroup row defaultValue="theme1" onChange={handleTheme}>
              <FormControlLabel value="theme1" control={<Radio />} label="Theme1"/>
              <FormControlLabel value="theme2" control={<Radio />} label="Theme2"/>
            </RadioGroup>
          </FormControl>
          <FormControlLabel control={<Switch id="darkmode-switch" checked={darkMode} onChange={handleDarkMode}/>} label="Dark mode"/>
          <FormControlLabel control={<Switch id="volume-switch" checked={sound} onChange={handleSound}/>} label="Sound"/>
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Suomi</Grid>
            <Grid item>
              <Switch id="language-switch" checked={language === "en"} onChange={handleLanguage}/>
            </Grid>
            <Grid item>English</Grid>
          </Grid>
        </Stack>
      </Modal>
    </div>
  );
}

export default Settings;