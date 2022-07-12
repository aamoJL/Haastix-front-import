import { Modal, Typography, Stack, IconButton, Switch, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio, Grid, Paper, PaletteMode, ThemeOptions } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import React, { useEffect, useState } from "react"
import { getTranslation, Language, Translation } from "../translations"
import { ThemeVariables } from "../interfaces"

const paperStyle = {
  position: "absolute" as "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  pl: 2,
  pt: 1,
  pb: 1,
}

interface Props {
  open: boolean
  handleClose: () => void
}

const defaultTheme: ThemeVariables = {
  color: "green",
  mode: "dark",
  style: "1"
}

const Settings = (props: Props) => {
  const [theme, setTheme] = useState<ThemeVariables>(localStorage.getItem("theme") !== null ? JSON.parse(localStorage.getItem("theme")!) : defaultTheme)
  const {color, mode, style} = theme
  const [sound, setSound] = useState(false) //toggle sound
  const [language, setLanguge] = useState<Language>(localStorage.getItem("language") === null ? "en" : (localStorage.getItem("language") as Language)) //toggle language
  const [translation, setTranslation] = useState<Translation>(getTranslation(language))
  const handleSound = () => setSound(!sound)

  // const handleTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setTheme((event.target as HTMLInputElement).value)
  // }

  /**
   * Event handler for language switch, sets localstorage languge value to selected language
   */
  const handleLanguage = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    let lang: Language = checked ? "en" : "fi"
    setLanguge(lang)
    setTranslation(getTranslation(lang))
    localStorage.setItem("language", lang)
    document.dispatchEvent(new Event("language-change"))
  }

  /**
   * Event handler for switching to dark mode
   */
  const handleThemeMode = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    let themeMode: PaletteMode = checked ? "dark" : "light"
    setTheme((prevMode) => ({
      ...prevMode,
      mode: themeMode
    }))
  }

  const handleColorsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme((prevState) => ({
      ...prevState,
      color: (event.target as HTMLInputElement).value
    }))
  }

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme))
    document.dispatchEvent(new Event("theme-change"))
  }, [theme])

  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Paper sx={paperStyle}>
        <Stack>
          <Stack direction="row-reverse" justifyContent="space-between">
            <IconButton onClick={props.handleClose}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h5">{translation.titles.settings}</Typography>
          </Stack>
          <FormControl>
            <FormLabel>{translation.titles.theme}</FormLabel>
            <RadioGroup row value={color} onChange={handleColorsChange}>
              <FormControlLabel id="theme1" value={"green"} control={<Radio />} label={`${translation.titles.theme} 1`} />
              <FormControlLabel id="theme2" value={"red"} control={<Radio />} label={`${translation.titles.theme} 2`} />
            </RadioGroup>
            {/* <FormLabel>{translation.titles.style}</FormLabel>
            <RadioGroup row value={theme} onChange={handleTheme}>
              <FormControlLabel value="Style1" control={<Radio />} label={`${translation.titles.style} 1`} />
              <FormControlLabel value="Style2" control={<Radio />} label={`${translation.titles.style} 2`} />
            </RadioGroup> */}
          </FormControl>
          <FormControlLabel control={<Switch id="darkmode-switch" checked={mode === "dark"} onChange={handleThemeMode} />} label={translation.inputs.texts.darkmode} />
          <FormControlLabel control={<Switch id="volume-switch" checked={sound} onChange={handleSound} />} label={translation.inputs.texts.sound} />
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Suomi</Grid>
            <Grid item>
              <Switch id="language-switch" checked={language === "en"} onChange={handleLanguage} />
            </Grid>
            <Grid item>English</Grid>
          </Grid>
        </Stack>
      </Paper>
    </Modal>
  )
}

export default Settings
