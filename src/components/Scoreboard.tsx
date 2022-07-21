import { Avatar, IconButton, Modal, Stack, StackProps, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Socket } from "socket.io-client"
import { PlayerData } from "../interfaces"
import { getEmojiImage } from "./storage/Images"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import LanguageContext from "./Context/LanguageContext"

interface Props {
  socket?: Socket
  scores: PlayerData[]
  timeIsUp: boolean
  stackProps?: StackProps
}

interface SegmentedTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const modalStyle: SxProps<Theme> = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.default",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
}

/**
 * Component that renders challenge room's scoreboard sorted by task completion time.
 * Clicking a player in the scoreboard table will pop up a modal
 * that shows the player's submissions.
 * @param socket Socket.io socket connection
 */
function Scoreboard({ socket, scores, timeIsUp, ...stackProps }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | undefined>(undefined)
  const [selectedPhoto, setSelectedPhoto] = useState<string | undefined>(undefined)
  const [selectedPhotoNumber, setSelectedPhotoNumber] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [modalLoading, setModalLoading] = useState(true)
  const translation = useContext(LanguageContext)

  const calculateTimeLeft = (milliseconds: number) => {
    if (milliseconds != null) {
      let time: SegmentedTime = {
        days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
        hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((milliseconds / 1000 / 60) % 60),
        seconds: Math.floor((milliseconds / 1000) % 60),
      }
      let timeString = time.days + time.hours + time.minutes + time.seconds < 0 ? "-" : ""
      timeString = timeString + (Math.abs(time.hours) < 10 ? "0" : "") + Math.abs(time.hours) + ":"
      timeString = timeString + (Math.abs(time.minutes) < 10 ? "0" : "") + Math.abs(time.minutes) + ":"
      timeString = timeString + (Math.abs(time.seconds) < 10 ? "0" : "") + Math.abs(time.seconds)

      return timeString
    }
  }

  useEffect(() => {
    if (selectedPlayer) {
      // Fetch selected photo file
      fetch(`${process.env.REACT_APP_API_URL}/challenge/fetchfile/${selectedPlayer.submissions[selectedPhotoNumber].submissionId}`, {
        method: "GET",
        headers: {
          Authorization: "bearer " + sessionStorage.getItem("token"),
        },
      })
        .then(async (res) => {
          let file = await res.blob()
          let reader = new FileReader()
          reader.readAsDataURL(file)

          reader.onloadend = () => {
            setSelectedPhoto(reader.result as string)
            setModalLoading(false)
          }
        })
        .catch((error) => console.log(error))
    }
  }, [selectedPhotoNumber, selectedPlayer])

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, player: PlayerData) => {
    if (player.submissions.length > 0) {
      // Open submissions modal only if the player has approved submissions
      if (selectedPlayer !== player && timeIsUp === true) {
        setModalLoading(true)
        setSelectedPhotoNumber(0)
        setSelectedPlayer(player)
      }
      setOpenModal(true)
    }
  }

  const handlePhotoArrowClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, photoNumber: number) => {
    // Flip number if over the photo count range
    if (selectedPlayer) {
      if (photoNumber < 0) {
        photoNumber = selectedPlayer.submissions.length - 1
      } else if (photoNumber >= selectedPlayer.submissions.length) {
        photoNumber = 0
      }
    } else {
      photoNumber = 0
    }
    setSelectedPhotoNumber(photoNumber)
  }

  // Scoreboard table row elements
  let scoreElements = scores.map((player, i) => {
    return (
      <TableRow id={`scoreboard-row-${i}`} hover key={player.playerName} onClick={(e) => handleRowClick(e, player)}>
        <TableCell>{i + 1}</TableCell>
        <TableCell>
          <Avatar sx={{ width: 24, height: 24 }} src={getEmojiImage(parseInt(player.playerAvatar))} alt="avatar" />
        </TableCell>
        <TableCell align="left" id={`scoreboard-name-${i}`}>
          {player.playerName}
        </TableCell>
        <TableCell align="right" id={`scoreboard-time-${i}`}>
          {calculateTimeLeft(player.totalTime * 1000)}
        </TableCell>
        <TableCell align="right" id={`scoreboard-tasks-${i}`}>
          {player.submissions.length}
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Stack {...stackProps} direction="column" alignItems="center">
      <Typography id="times-up-title" variant="body1" component="p">
        {translation.titles.scoreboard}
      </Typography>
      <Modal open={openModal && !modalLoading} onClose={() => setOpenModal(false)} disableAutoFocus>
        <Stack sx={modalStyle} alignItems="center" direction="row" spacing={2}>
          <IconButton id="prev-photo-btn" onClick={(e) => handlePhotoArrowClick(e, selectedPhotoNumber - 1)}>
            <ArrowBackIcon />
          </IconButton>
          <Stack direction="column" alignItems="center" spacing={1}>
            <Typography sx={{ fontWeight: "bold" }} variant="body1" component="p">{`${selectedPlayer?.playerName}`}</Typography>
            <img src={selectedPhoto} alt="" />
            <Typography variant="body1" component="p">{`${translation.texts.taskNumber}: ${selectedPhotoNumber + 1}`}</Typography>
          </Stack>
          <IconButton id="next-photo-btn" onClick={(e) => handlePhotoArrowClick(e, selectedPhotoNumber + 1)}>
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
      </Modal>
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{translation.tables.avatar}</TableCell>
              <TableCell align="left">{translation.tables.name}</TableCell>
              <TableCell align="right">{translation.tables.time}</TableCell>
              <TableCell align="right">{translation.tables.tasks}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{scoreElements}</TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default Scoreboard
