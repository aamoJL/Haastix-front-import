import InfoIcon from "@mui/icons-material/Info"
import SettingsIcon from "@mui/icons-material/Settings"
import HomeIcon from "@mui/icons-material/Home"
import ExpandIcon from "@mui/icons-material/ExpandMore"
import { Link } from "react-router-dom"
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Modal, Paper, Stack, Tooltip, Typography } from "@mui/material"
import ExitButton from "./ExitButton"
import Settings from "./Settings"
import { useState } from "react"

const paperStyle = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  maxHeight: 500,
  overflow: "auto",
  p: 1
}

interface Props {
  isHomePage?: boolean
  isLoggedIn?: boolean
}

function SettingsHomeButtons({ isHomePage = false, isLoggedIn = false }: Props) {
  const [open, setOpen] = useState(false) // if true open settings page
  const [openTutorial, setOpenTutorial] = useState(false)
  const handleChange = () => setOpen(!open)

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
          <Typography>Info</Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>Home</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>fisdjfijsodjfidsjfjs</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>Create game</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>fisdjfijsodjfidsjfjs</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>Join a game</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>fisdjfijsodjfidsjfjs</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>Waiting room</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>fisdjfijsodjfidsjfjs</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography>Challenge room</Typography>
            </AccordionSummary>
            <AccordionDetails>            
              <Typography>fisdjfijsodjfidsjfjs</Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Modal>
    </Stack>
  )
}

export default SettingsHomeButtons
