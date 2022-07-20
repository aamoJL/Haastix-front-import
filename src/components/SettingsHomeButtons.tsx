import InfoIcon from "@mui/icons-material/Info"
import SettingsIcon from "@mui/icons-material/Settings"
import HomeIcon from "@mui/icons-material/Home"
import ExpandIcon from "@mui/icons-material/ExpandMore"
import CloseIcon from "@mui/icons-material/Close"
import { Link } from "react-router-dom"
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Modal, Paper, Stack, Tooltip, Typography } from "@mui/material"
import ExitButton from "./ExitButton"
import Settings from "./Settings"
import { useContext, useState } from "react"
import LanguageContext from "./Context/LanguageContext"

const paperStyle = {
  position: "fixed",
  top: "5%",
  left: "50%",
  transform: "translate(-50%, 0)",
  width: 300,
  maxHeight: 500,
  overflow: "auto",
  p: 1,
}

interface Props {
  isHomePage?: boolean
  isLoggedIn?: boolean
}

function SettingsHomeButtons({ isHomePage = false, isLoggedIn = false }: Props) {
  const [open, setOpen] = useState(false) // if true open settings page
  const [openTutorial, setOpenTutorial] = useState(false)
  const [tutorialPage, setTutorialPage] = useState<string>("")
   const handleChange = () => setOpen(!open)
  const translation = useContext(LanguageContext)

  const handleTutorial = (panel: string) => (event: React.SyntheticEvent, expanded: boolean) => {
    setTutorialPage(expanded ? panel : "");
  };

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
            <Typography variant="h4" component="h4">{translation.tutorial.title}</Typography>
            <IconButton id="close-tutorial" onClick={() => setOpenTutorial(false)}>
              <CloseIcon/>
            </IconButton>
          </Stack>
          <Accordion expanded={tutorialPage === "home"} onChange={handleTutorial("home")}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>{translation.tutorial.titles.home}</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>{translation.tutorial.descriptions.home}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={tutorialPage === "create"} onChange={handleTutorial("create")}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>{translation.tutorial.titles.createChallenge}</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>{translation.tutorial.descriptions.createChallenge}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={tutorialPage === "join"} onChange={handleTutorial("join")}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>{translation.tutorial.titles.joinChallenge}</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>{translation.tutorial.descriptions.joinChallenge}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={tutorialPage === "wait"} onChange={handleTutorial("wait")}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>{translation.tutorial.titles.waitingRoom}</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>{translation.tutorial.descriptions.waitingRoom}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={tutorialPage === "chlroom"} onChange={handleTutorial("chlroom")}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>{translation.tutorial.titles.challengeRoom}</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>{translation.tutorial.descriptions.challengeRoom}</Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Modal>
    </Stack>
  )
}

export default SettingsHomeButtons
