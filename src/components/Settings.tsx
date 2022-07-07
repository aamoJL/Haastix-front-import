import { Modal, Typography, Stack, IconButton, Switch, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio, Grid, Paper, PaletteMode } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'
import React, { useState } from 'react';
import { getTranslation, Language, Translation } from '../translations';

const style = {
  position: 'absolute' as 'absolute',
  top: '20%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  pl: 2,
  pt: 1,
  pb: 1
};

interface Props {
  open: boolean,
  handleClose: () => void
};

const Settings = (props: Props) => {
  const [themeMode, setThemeMode] = useState<PaletteMode>(localStorage.getItem("mode") === null ? "light" : localStorage.getItem("mode") as PaletteMode); //switch between dark and light
  const [sound, setSound] = useState(false); //toggle sound
  const [language, setLanguge] = useState<Language>(localStorage.getItem("language") === null ? "en" : localStorage.getItem("language") as Language); //toggle language
  const [translation, setTranslation] = useState<Translation>(getTranslation(language));
  const [theme, setTheme] = useState("theme1"); //set what theme to use 
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
    setTranslation(getTranslation(lang));
    localStorage.setItem("language", lang);
    document.dispatchEvent(new Event("language-change"));
  }


  /**
   * Event handler for switching to dark mode 
   */
  const handleThemeMode = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    let mode : PaletteMode = checked ? "dark" : "light"
    setThemeMode(mode);
    localStorage.setItem("mode", mode);
    document.dispatchEvent(new Event("mode-change"))
  }
 
  return (
      <Modal open={props.open} onClose={props.handleClose}>
        <Paper sx={style}>
          <Stack >
            <Stack direction="row-reverse" justifyContent="space-between">
              <IconButton onClick={props.handleClose}>
                <CloseIcon/>
              </IconButton>
              <Typography variant="h5">
                {translation.titles.settings}
              </Typography>
            </Stack>
            <FormControl>
              <FormLabel >{translation.titles.theme}</FormLabel>
              <RadioGroup row value={theme} onChange={handleTheme}>
                <FormControlLabel value="theme1" control={<Radio />} label={`${translation.titles.theme} 1`}/>
                <FormControlLabel value="theme2" control={<Radio />} label={`${translation.titles.theme} 2`}/>
              </RadioGroup>
            </FormControl>
              <FormControlLabel control={<Switch id="darkmode-switch" checked={themeMode === "dark"} onChange={handleThemeMode}/>} label={translation.inputs.texts.darkmode}/>
              <FormControlLabel control={<Switch id="volume-switch" checked={sound} onChange={handleSound}/>} label={translation.inputs.texts.sound}/>
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>Suomi</Grid>
              <Grid item>
                <Switch id="language-switch" checked={language === "en"} onChange={handleLanguage}/>
              </Grid>
              <Grid item>English</Grid>
            </Grid>
          </Stack>
        </Paper>
      </Modal>
  );
}

export default Settings;