import { Button, Dialog, DialogActions, DialogTitle, IconButton } from "@mui/material"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import LogoutIcon from "@mui/icons-material/Logout"

interface Props {
  isGameEnded?: boolean
}

const ExitButton = ({ isGameEnded = false }: Props) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const navigate = useNavigate()

  const exitChallengeRoom = () => {
    fetch(`${process.env.REACT_APP_API_URL}/challenge/exit`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${sessionStorage.getItem("token")}`,
      },
    }).catch((error) => {
      console.log(error)
    })
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("taskOrder")
    navigate("/")
  }

  return (
    <div>
      {isGameEnded && (
        <IconButton color="error" id="exit-btn" onClick={exitChallengeRoom}>
          <LogoutIcon />
        </IconButton>
      )}
      {!isGameEnded && (
        <IconButton color="error" id="exit-btn" onClick={handleOpen}>
          <LogoutIcon />
        </IconButton>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle alignSelf="center">Do you want to exit</DialogTitle>
        <DialogActions>
          <Button sx={{ width: 20 }} id="confirm-exit-btn" onClick={exitChallengeRoom}>
            Yes
          </Button>
          <div style={{ flex: "1 0 0" }} />
          <Button sx={{ width: 20 }} id="close-exit-btn" onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ExitButton
