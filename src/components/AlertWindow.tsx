import { Alert } from "@mui/material"
import { useNavigate } from "react-router-dom"

interface Props {
  message: String
}

/**
 * Returns MUI Alert that will navigate to root when closed
 * @param message message text
 * @returns MUI alert
 */
function AlertWindow({ message }: Props) {
  const navigation = useNavigate()

  const handleClose = () => {
    navigation("/")
  }

  return (
    <Alert style={{ position: "absolute", top: "50px", left: "50%", transform: "translate(-50%, 0%)" }} onClose={handleClose} severity="error" sx={{ width: "auto" }}>
      {message}
    </Alert>
  )
}

export default AlertWindow
