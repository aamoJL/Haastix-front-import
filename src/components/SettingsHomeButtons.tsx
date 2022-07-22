import InfoIcon from "@mui/icons-material/Info"
import SettingsIcon from "@mui/icons-material/Settings"
import HomeIcon from "@mui/icons-material/Home"
import ExpandIcon from "@mui/icons-material/ExpandMore"
import CloseIcon from "@mui/icons-material/Close"
import Next from "@mui/icons-material/NavigateNext"
import { Link } from "react-router-dom"
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Modal, Paper, Stack, Tooltip, Typography } from "@mui/material"
import ExitButton from "./ExitButton"
import Settings from "./Settings"
import { useContext, useState } from "react"
import LanguageContext from "./Context/LanguageContext"

const paperStyle = {
  position: "fixed",
  top: "5%",
  left: "50%",
  transform: "translate(-50%, 0)",
  width: "100%",
  maxWidth: 500,
  height: "70%",
  maxHeight: 900,
  overflow: "auto",
  p: 1,
}

interface Props {
  isHomePage?: boolean
  isLoggedIn?: boolean
}

/**
 * Component that renders header buttons (e.g. home, disconnect, settings)
 */
function SettingsHomeButtons({ isHomePage = false, isLoggedIn = false }: Props) {
  const [open, setOpen] = useState(false) // if true open settings page
  const [openTutorial, setOpenTutorial] = useState(false)
  const [tutorialPage, setTutorialPage] = useState<string>("")
  const handleChange = () => setOpen(!open)
  const translation = useContext(LanguageContext)

  const handleTutorial = (panel: string) => (event: React.SyntheticEvent, expanded: boolean) => {
    setTutorialPage(expanded ? panel : "")
  }

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Tooltip title="Settings">
        <IconButton aria-label="settings" id="settings-btn" onClick={handleChange}>
          <SettingsIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Info">
        <IconButton aria-label="info" id="info-btn" onClick={() => setOpenTutorial(true)}>
          <InfoIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      {!isHomePage && (
        <Tooltip title="Home">
          <IconButton component={Link} to="/" aria-label="home" id="home-btn">
            <HomeIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
      {isLoggedIn && <ExitButton />}
      <Settings open={open} handleClose={handleChange} />
      <Modal open={openTutorial} onClose={() => setOpenTutorial(false)}>
        <Paper sx={paperStyle}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4" component="h4">
              {translation.tutorial.title}
            </Typography>
            <IconButton id="close-tutorial" onClick={() => setOpenTutorial(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Accordion expanded={tutorialPage === "gm"} onChange={handleTutorial("gm")}>
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <Typography>{translation.tutorial.titles.gameMaster}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {translation.tutorial.descriptions.gameMaster.map((value, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <Next />
                    </ListItemIcon>
                    <ListItemText>{value}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={tutorialPage === "player"} onChange={handleTutorial("player")}>
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <Typography>{translation.tutorial.titles.player}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {translation.tutorial.descriptions.player.map((value, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <Next />
                    </ListItemIcon>
                    <ListItemText>{value}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Modal>
    </Stack>
  )
}

export default SettingsHomeButtons
