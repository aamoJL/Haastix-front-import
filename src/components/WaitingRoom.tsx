import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, Collapse, Stack, Typography, TableBody, TableRow, Table, TableCell, TextField, ButtonGroup, IconButton, Box, TableContainer, TableHead, FormControlLabel, Switch, InputAdornment, Alert, CollapseProps } from "@mui/material"
import { ChallengeTask, GameEndResponce, JoinChallengeSuccessResponse, WaitingRoomList, WaitingRoomNewPlayer, YouWereRemovedResponse } from "../interfaces"
import { Socket } from "socket.io-client"
import ChallengeRoom from "./ChallengeRoom"
import RemovePlayer from "./RemovePlayer"
import AlertWindow from "./AlertWindow"
import CloseIcon from "@mui/icons-material/Close"
import LanguageContext from "./Context/LanguageContext"
import Bouncyfeeling from "./Bouncyfeeling"
import KeyIcon from "@mui/icons-material/Key"
import PersonIcon from "@mui/icons-material/Person"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import notificationSound from "../assets/notificationSound.mp3"

interface Props {
  roomInfo: JoinChallengeSuccessResponse
  socket?: Socket
}

interface SegmentedTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function WaitingRoom({ roomInfo, socket }: Props) {
  /**
   * Returns object with segmented time between now and end date
   * @param delayTime end date
   * @returns segmentedTime object
   */
  const calculateTimeLeft = (milliseconds: number) => {
    let time: SegmentedTime = {
      days: Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
      hours: Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((milliseconds / 1000 / 60) % 60),
      seconds: Math.floor((milliseconds / 1000) % 60),
    }
    return time
  }

  /**
   * Returns date string in "(-)HH:MM:SS" format
   * @param time segmentedTime object
   * @returns formatted time string
   */
  const getFormattedTime = (time: SegmentedTime) => {
    let timeString = time.days + time.hours + time.minutes + time.seconds < 0 ? "-" : ""
    timeString = timeString + (Math.abs(time.hours) < 10 ? "0" : "") + Math.abs(time.hours) + ":"
    timeString = timeString + (Math.abs(time.minutes) < 10 ? "0" : "") + Math.abs(time.minutes) + ":"
    timeString = timeString + (Math.abs(time.seconds) < 10 ? "0" : "") + Math.abs(time.seconds)
    return timeString
  }

  const isGameMaster = roomInfo.details.isGameMaster
  const millisecondsLeft = new Date(roomInfo.details.challengeStartDate as string).getTime() - new Date().getTime()

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(millisecondsLeft))
  const [timeIsUp, setTimeIsUp] = useState(millisecondsLeft <= 0)
  const [playerArray, setPlayerArray] = useState<WaitingRoomList[]>([])
  const [alertMessage, setAlertMessage] = useState("")
  const [alertWindow, setAlertWindow] = useState(false)
  const [showPlayers, setShowPlayers] = useState(false)
  const [showChallenges, setShowChallenges] = useState(false)
  const [edit, setEdit] = useState(false)
  const [challengeArray, setChallengeArray] = useState<ChallengeTask[]>(roomInfo.details.challengeTasks)
  const [startGame, setStartGame] = useState(false)
  const [timer, setTimer] = useState(10)
  const [showGamemasterLeftAlert, setShowGamemasterLeftAlert] = useState(false)
  const [randomOrder, setRandomOrder] = useState(roomInfo.details.isRandom)
  const [initClick, setInitClick] = useState(false)
  const translation = useContext(LanguageContext)
  const pauseDateRef = useRef<number>()
  const audioPlayer = useRef<HTMLAudioElement>(null)

  const playNotification = () => {
    if (audioPlayer.current !== null && audioPlayer.current.muted === false) {
      audioPlayer.current.play()
    }
  }

  useEffect(() => {
    document.addEventListener("click", () => {
      if (audioPlayer.current !== null && initClick === false) {
        setInitClick(true)
        if (localStorage.getItem("muted") === null) {
          audioPlayer.current.muted = false
          localStorage.setItem("muted", JSON.stringify(false))
        } else {
          audioPlayer.current.muted = JSON.parse(localStorage.getItem("muted")!)
        }
      }
    })

    function event() {
      if (audioPlayer.current !== null) {
        audioPlayer.current.muted = JSON.parse(localStorage.getItem("muted")!)
      }
    }
    document.addEventListener("sound-change", event)

    return () => {
      document.removeEventListener("sound-change", event)
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (roomInfo.details.isPaused) {
        return // Disable clock if the game is paused
      }
      const startDate = new Date(roomInfo.details.challengeStartDate as string)
      const milliseconds = startDate.getTime() - new Date().getTime()
      const segmentedTime = calculateTimeLeft(milliseconds)
      setTimeLeft(segmentedTime)
      if (milliseconds <= 0) {
        playNotification()
        setTimeIsUp(true)
        clearInterval(interval)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [roomInfo.details.challengeStartDate, roomInfo.details.isPaused])

  useEffect(() => {
    if (!roomInfo.details.isActive) {
      setTimeIsUp(true)
    }
  }, [roomInfo.details.isActive])

  useEffect(() => {
    // Set Socket.io Listeners | newPlayer listener
    socket?.on("newPlayer", (data: WaitingRoomNewPlayer) => {
      // set players from data to players
      setPlayerArray(data.players)
      // set loading false
      // setLoading(false);
    })

    socket?.on("youWereRemoved", (data: YouWereRemovedResponse) => {
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("taskOrder")
      setAlertMessage(data.message)
      setAlertWindow(true)
    })

    socket?.on("playerWasRemoved", (data: WaitingRoomNewPlayer) => {
      setPlayerArray(data.players)
    })

    socket?.on("gmLeft", (data: GameEndResponce) => {
      roomInfo.details.isActive = data.isActive
      if (!data.isActive) {
        setShowGamemasterLeftAlert(true)
        setTimeIsUp(true)
      }
    })

    // get token
    // getToken();
    // toggle loadingscreen
    // setLoading(false);
    return () => {
      // Clear socket.io Listeners , newPlayer
      socket?.off("newPlayer")
      socket?.off("playerWasRemoved")
      socket?.off("youWereRemoved")
      socket?.off("gmLeft")
    }
  })

  useEffect(() => {
    if (roomInfo.details.isPaused) {
      // Game is paused
      if (!edit || showPlayers || !showChallenges) {
        // Unpause if edit was disabled or challenges were closed.
        let pauseTime = 0
        if (pauseDateRef.current !== undefined) {
          pauseTime = Date.now() - pauseDateRef.current
        }
        socket?.emit("pauseGame", {
          token: roomInfo.details.token,
          payload: {
            isPaused: false,
            pauseTime: pauseTime,
          },
        })
      }
    } else {
      // Game is not paused
      if (edit && showChallenges) {
        // Pause the game if edit form is visible
        setStartGame(false)
        pauseDateRef.current = Date.now()
        socket?.emit("pauseGame", {
          token: roomInfo.details.token,
          payload: {
            isPaused: true,
          },
        })
      }
    }
  }, [edit, showPlayers, showChallenges])

  const handleShowPlayers = () => {
    setShowChallenges(false)
    setShowPlayers(!showPlayers)
  }

  const handleShowChallenges = () => {
    setShowPlayers(false)
    setShowChallenges(!showChallenges)
    setEdit(false)
  }

  const handleEditView = () => {
    setChallengeArray(roomInfo.details.challengeTasks)
    setEdit(true)
  }

  const handleEditChallenge = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newArray = challengeArray.map((challenge) => {
      if (challenge.taskNumber === index + 1) {
        return { ...challenge, taskDescription: e.target.value }
      }
      return challenge
    })
    setChallengeArray(newArray)
  }

  const handleAddChallenge = () => {
    const newArr = challengeArray.concat({ taskNumber: challengeArray.length + 1, taskDescription: "", taskId: "taskId" })
    const fixedArr = changeChallengeNumbers(newArr)
    setChallengeArray(fixedArr)
  }

  const handleRemoveChallenge = (i: number) => {
    const newArr = challengeArray.filter((challenge) => challenge.taskNumber !== i + 1)
    if (challengeArray.length < 1) setChallengeArray(challengeArray)
    else {
      const fixedArr = changeChallengeNumbers(newArr)
      setChallengeArray(fixedArr)
    }
  }

  const changeChallengeNumbers = (arr: ChallengeTask[]) => {
    const newArr = arr.map((challenge, index) => {
      return { ...challenge, taskNumber: index + 1 }
    })
    return newArr
  }

  const handleSaveChallenges = () => {
    const filteredArr = challengeArray.filter((challenge) => challenge.taskDescription !== "")
    setChallengeArray(filteredArr)
    socket?.emit("modifyChallenge", {
      token: roomInfo.details.token,
      payload: {
        challengeName: roomInfo.details.challengeRoomName,
        challengeTasks: filteredArr,
        isRandom: randomOrder,
      },
    })

    setEdit(false)
  }

  const handleStartGame = () => {
    setStartGame(!startGame)
    setTimer(10)
  }

  useEffect(() => {
    if (startGame && timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)

      return () => clearInterval(interval)
    }
    if (timer === 0) {
      socket?.emit("startGame", {
        token: roomInfo.details.token,
      })
    }
  }, [timer, startGame])

  return (
    <Stack style={{ width: "100%", margin: "0 auto", maxWidth: "480px", padding: "0 20px" }} alignItems="center" justifyContent="center" spacing={1}>
      <audio autoPlay muted ref={audioPlayer} src={notificationSound}></audio>
      {!timeIsUp && !alertWindow && (
        <>
          <Box display="flex" flexDirection="row" width="100%" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box width="50%" display="flex">
              <MeetingRoomIcon sx={{ mr: 1 }} />
              <Typography variant="body1" component="p" id="room-title" textOverflow="ellipsis" overflow="auto">
                {roomInfo.details.challengeRoomName}
              </Typography>
            </Box>
            <Box width="50%" display="flex" justifyContent="end">
              <Typography variant="body1" component="p" id="user-title" textOverflow="ellipsis" overflow="auto">
                {roomInfo.details.isGameMaster ? translation.texts.youAreGamemaster : roomInfo.details.userName}
              </Typography>
              <PersonIcon sx={{ ml: 1 }} />
            </Box>
          </Box>
          {isGameMaster && (
            <Box display="flex" width="100%" alignItems="center">
              <Box display="flex" flex="1 1 0px" justifyContent="end">
                <KeyIcon fontSize="large" sx={{ mr: 2 }}></KeyIcon>
              </Box>
              <Box display="flex" justifyContent="center" flex="1 1 0px">
                <Box display="flex" justifyContent="center" alignItems="center" borderRadius=".4em" sx={{ width: "8em", height: "4em" }} bgcolor="primary.main">
                  <Typography color="primary.contrastText" id="room-code-value" variant="h3" component="h3">
                    <b>{roomInfo.details.challengeRoomCode}</b>
                  </Typography>
                </Box>
              </Box>
              <Box flex={"1 1 0px"}></Box>
            </Box>
          )}
          <Typography id="room-status-label" textAlign="center" variant="h5" component="h5">
            {roomInfo.details.isPaused ? translation.texts.gameIsPaused : translation.texts.challengeBeginsIn}
          </Typography>
          <Typography visibility={roomInfo.details.isPaused ? "hidden" : "visible"} id="timer-gm" variant="h3" component="h3">
            {getFormattedTime(timeLeft)}
          </Typography>

          {isGameMaster && (
            <>
              <Button disabled={roomInfo.details.isPaused} color={startGame ? "warning" : "primary"} sx={{ width: "auto", minWidth: 200 }} id="start-game-btn" onClick={handleStartGame}>
                {startGame ? `${translation.inputs.buttons.cancel} (${timer})` : `${translation.inputs.buttons.start}`}
              </Button>
              <ButtonGroup>
                <Button id="show-players-btn" onClick={handleShowPlayers}>
                  {translation.inputs.buttons.players} ({playerArray.length})
                </Button>
                <Button id="show-challenges-btn" onClick={handleShowChallenges}>
                  {translation.inputs.buttons.challenges} ({roomInfo.details.challengeTasks.length})
                </Button>
              </ButtonGroup>
              <RemovePlayer {...({ sx: { width: "100%" } } as CollapseProps)} socket={socket} roomInfo={roomInfo} playerArray={playerArray} open={showPlayers} />
              <Collapse sx={{ width: "100%" }} in={showChallenges} unmountOnExit>
                {!edit && (
                  <Stack alignItems="center" width="100%">
                    {
                      <TableContainer sx={{ maxHeight: 300 }}>
                        <Table size="small" stickyHeader sx={{ tableLayout: "auto", wordBreak: "break-all" }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell>{translation.tables.description}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {roomInfo.details.challengeTasks.map((value, i) => (
                              <TableRow key={i}>
                                <TableCell align="left">
                                  <Typography variant="body1" component="p">
                                    {value.taskNumber}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ textOverflow: "ellipsis" }} align="left">
                                  {value.taskDescription}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    }
                    <Button id="edit-btn" variant="text" onClick={handleEditView}>
                      {translation.inputs.buttons.edit}
                    </Button>
                  </Stack>
                )}
                {edit && (
                  <Stack spacing={1} width="100%">
                    <FormControlLabel sx={{ width: "100%", justifyContent: "center", m: 0 }} control={<Switch id="edit-randomOrder-switch" checked={randomOrder} onChange={() => setRandomOrder(!randomOrder)} />} labelPlacement="start" label={translation.texts.randomTasks}></FormControlLabel>
                    <Box sx={{ maxHeight: 255, overflow: "auto" }}>
                      {challengeArray.map((value, i) => (
                        <TextField
                          key={i}
                          autoFocus
                          id={`challenge-edit-input-${i}`}
                          sx={{ mb: 1 }}
                          value={value.taskDescription}
                          size="small"
                          multiline
                          fullWidth
                          onChange={(e) => handleEditChallenge(e, i)}
                          inputProps={{ maxLength: 256 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton color="error" edge="end" onClick={() => handleRemoveChallenge(i)}>
                                  <CloseIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        ></TextField>
                      ))}
                    </Box>
                    <ButtonGroup variant="text" sx={{ alignSelf: "center" }}>
                      <Button id="add-challenge-btn" onClick={handleAddChallenge}>
                        {translation.inputs.buttons.add}
                      </Button>
                      <Button id="save-challenges-btn" onClick={handleSaveChallenges}>
                        {translation.inputs.buttons.save}
                      </Button>
                      <Button id="cancel-edit-btn" onClick={() => setEdit(false)}>
                        {translation.inputs.buttons.cancel}
                      </Button>
                    </ButtonGroup>
                  </Stack>
                )}
              </Collapse>
            </>
          )}
          {!isGameMaster && playerArray.length > 0 && <Bouncyfeeling players={playerArray} />}
        </>
      )}
      {timeIsUp && !roomInfo.details.isPaused && <ChallengeRoom socket={socket} roomInfo={roomInfo} playerArray={playerArray} playNotification={playNotification} />}
      {showGamemasterLeftAlert && (
        <Alert style={{ position: "absolute", top: "50px", left: "50%", transform: "translate(-50%, 0%)" }} onClick={() => setShowGamemasterLeftAlert(false)} severity="error" sx={{ width: "auto" }}>
          {translation.errors.gameMasterLeft}
        </Alert>
      )}
      {alertWindow && <AlertWindow message={alertMessage} />}
    </Stack>
  )
}

export default WaitingRoom
